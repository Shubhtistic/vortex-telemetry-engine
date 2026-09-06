from fastapi import APIRouter

from src.vortex.shared.responses import ApiResponse
from src.vortex.auth.dependencies import CurrentUserDep
from src.vortex.shared.database import DbSessionDep

from .services import UserService
from .exceptions import UserNotFoundError

# --- router ---
router = APIRouter(prefix="/users")


# --- /me for user ----


@router.get("/me")
async def get_user_info(db_session: DbSessionDep, current_user: CurrentUserDep):

    try:
        data = await UserService.get_user_info_by_id(
            current_user.get("user_id"), db_session=db_session
        )
    except UserNotFoundError:
        return ApiResponse.error(message="user not found", code=404)

    return ApiResponse.success(message="User fetched SucessFully", data=data)
