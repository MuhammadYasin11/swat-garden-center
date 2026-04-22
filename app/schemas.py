from pydantic import BaseModel
from typing import Optional

class User(BaseModel):
    username: str
    email: str
    role: str  # This is the key: "admin" or "customer"
    disabled: Optional[bool] = None

class UserInDB(User):
    hashed_password: str

class PlantSchema(BaseModel):
    name: str
    category: str
    type: str
    light_requirement: str
    water_frequency: str
    maintenance_level: str
    growth_rate: str
    temp_min: int
    temp_max: int
    price: int
    stock_quantity: int
    expert_score: float
    image_url: Optional[str] = None

class PlantDeleteSchema(BaseModel):
    name: str

class ToolSchema(BaseModel):
    name: str # Corresponding to 'name' in tools.csv
    category: str
    type: str # Corresponding to 'type' in tools.csv
    price: int
    stock_quantity: int
    expert_score: float
    image_url: Optional[str] = None

class ToolEditSchema(BaseModel):
    original_tool_name: str
    tool_data: ToolSchema

class ToolDeleteSchema(BaseModel):
    tool_name: str
