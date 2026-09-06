from datetime import datetime
from typing import Optional

from sqlalchemy import func, select, update
from sqlalchemy.ext.asyncio import AsyncSession

from src.vortex.shared.database import create, check_exists, execute_query, get_all

from .enums import ApiKeyStatus, TenantStatus
from .models import ApiKey, Tenant


class TenantRepository:
    @staticmethod
    async def create_tenant(
        tenant_instance: Tenant, db_session: AsyncSession
    ) -> Tenant:

        return await create(instance=tenant_instance, db_session=db_session)

    @staticmethod
    async def check_by_slug(slug: str, org_id: str, db_session: AsyncSession) -> bool:
        return await check_exists(
            model=Tenant,
            db_session=db_session,
            filters={"slug": slug, "organization_id": org_id},
        )

    @staticmethod
    async def get_all_tenants(
        org_id: str,
        db_session: AsyncSession,
        offset: int,
        limit: int,
    ) -> Optional[list[Tenant]]:
        """get all tenants for this organisation"""

        # get total count
        count_qry = (
            select(func.count())
            .select_from(Tenant)
            .where(Tenant.organization_id == org_id)
        )

        total_count = (
            await execute_query(query=count_qry, db_session=db_session)
        ).scalar_one()

        # get paginated data
        query = (
            select(Tenant)
            .where(
                Tenant.organization_id == org_id, Tenant.status == TenantStatus.active
            )
            .order_by(Tenant.created_at.desc())
            .limit(limit)
            .offset(offset)
        )

        data = await get_all(stmt=query, db_session=db_session)

        return data, total_count


class ApiKeyRepository:
    @staticmethod
    async def create_api_key(
        api_key_instance: ApiKey, db_session: AsyncSession
    ) -> ApiKey:

        return await create(instance=api_key_instance, db_session=db_session)

    @staticmethod
    async def check_by_api_key_slug(
        api_key_slug: str, tenant_id: str, db_session: AsyncSession
    ) -> bool:
        return await check_exists(
            model=ApiKey,
            db_session=db_session,
            filters={"api_key_slug": api_key_slug, "tenant_id": tenant_id},
        )

    @staticmethod
    async def check_non_active_api_key_exists(
        api_key_id: str, tenant_id: str, db_session: AsyncSession
    ) -> bool:
        stmt = select(1).where(
            ApiKey.id == api_key_id,
            ApiKey.tenant_id == tenant_id,
            ApiKey.status != ApiKeyStatus.active,
        )

        result = await execute_query(query=stmt, db_session=db_session)

        return result.scalar() is not None

    @staticmethod
    async def get_all_api_keys(
        tenant_id: str, db_session: AsyncSession, offset: int, limit: int
    ):

        # get total count
        total_count_qry = (
            select(func.count())
            .select_from(ApiKey)
            .where(ApiKey.tenant_id == tenant_id)
        )

        total = (
            await execute_query(query=total_count_qry, db_session=db_session)
        ).scalar_one()

        # get paginated data

        query = (
            select(ApiKey)
            .where(ApiKey.tenant_id == tenant_id, ApiKey.status == ApiKeyStatus.active)
            .order_by(ApiKey.created_at.desc())
            .limit(limit)
            .offset(offset)
        )

        results = await get_all(stmt=query, db_session=db_session)

        return results, total

    @staticmethod
    async def mark_as_grace_and_get_hashed_key(
        api_key_id: str,
        tenant_id: str,
        grace_period: datetime,
        db_session: AsyncSession,
    ) -> Optional[str]:
        # update query
        qry = (
            update(ApiKey)
            .where(
                ApiKey.id == api_key_id,
                ApiKey.tenant_id == tenant_id,
                ApiKey.status == ApiKeyStatus.active,
            )
            .values(
                status=ApiKeyStatus.grace_period,
                grace_expires_at=grace_period,
            )
            .returning(ApiKey.hashed_key)
        )

        # execeute update query
        result = await execute_query(query=qry, db_session=db_session)
        return result.scalar_one_or_none()

    @staticmethod
    async def get_auth_fields_by_hash(hashed_key: str, db_session: AsyncSession):
        """only returns selected columns needed for api key auth instead of full orm object"""

        stmt = select(
            ApiKey.id,
            ApiKey.tenant_id,
            ApiKey.organization_id,
            ApiKey.status,
            ApiKey.grace_expires_at,
            ApiKey.hashed_key,
        ).where(ApiKey.hashed_key == hashed_key)

        result = await execute_query(query=stmt, db_session=db_session)

        return result.one_or_none()

    @staticmethod
    async def set_as_revoked(
        hashed_key: str, revoked_at: datetime, db_session: AsyncSession
    ):
        """set the api key as revoked"""

        update_stmt = (
            update(ApiKey)
            .where(ApiKey.hashed_key == hashed_key)
            .values(
                revoked_at=revoked_at,
                status=ApiKeyStatus.revoked,
            )
        )

        await execute_query(query=update_stmt, db_session=db_session)
