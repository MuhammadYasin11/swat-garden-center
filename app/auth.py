from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from app.models import User

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

async def get_user_from_db(token: str):
    # Dummy implementation for now
    if token == "admin_token":
        return User(username="admin_user", email="admin@example.com", role="admin")
    elif token == "customer_token":
        return User(username="customer_user", email="customer@example.com", role="customer")
    return None

async def get_current_user(token: str = Depends(oauth2_scheme)):
    # 1. Decode JWT here
    # 2. Fetch user from your DB/File
    user = await get_user_from_db(token) 
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
    return user

async def get_admin_user(current_user: User = Depends(get_current_user)):
    if current_user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN, 
            detail="You do not have administrative privileges."
        )
    return current_user
