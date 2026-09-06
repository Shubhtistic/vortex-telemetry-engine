from datetime import datetime
from uuid import UUID
from pydantic import BaseModel, ConfigDict, EmailStr, Field

from .enums import InviteMembershipRole, MembershipRole


class SignupRequest(BaseModel):
    org_name: str
    slug: str
    email: EmailStr
    password: str
    first_name: str = Field(max_length=100)
    last_name: str = Field(max_length=100)


class InviteMemberRequest(BaseModel):
    first_name: str
    last_name: str
    password: str
    email: EmailStr
    role: InviteMembershipRole  # only "admin" or "analyst" accepted


class MembershipRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    user_id: UUID | str
    organization_id: UUID | str
    role: MembershipRole
    created_at: datetime


class OrgMemberRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    user_id: UUID
    role: MembershipRole
    email: EmailStr
    first_name: str
    last_name: str
