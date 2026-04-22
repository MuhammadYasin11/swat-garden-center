from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from app.schemas import User
from app.database import get_db
from app import models

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    if token == "admin_token":
        user = db.query(models.User).filter_by(username="admin").first()
        if user:
            return User(username=user.username, email="admin@example.com", role=user.role)
    elif token == "customer_token":
        return User(username="customer", email="customer@example.com", role="customer")
        
    raise HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Invalid authentication credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )

def get_admin_user(current_user: User = Depends(get_current_user)):
    if current_user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN, 
            detail="You do not have administrative privileges."
        )
    return current_user
