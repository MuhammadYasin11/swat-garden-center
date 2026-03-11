import pandas as pd
import os
import uuid
from datetime import datetime

class OrderManager:
    def __init__(self, data_file="data/orders.csv"):
        self.data_file = data_file
        self._ensure_file_exists()
        
    def _ensure_file_exists(self):
        if not os.path.exists(self.data_file):
            df = pd.DataFrame(columns=[
                "order_id", "date", "first_name", "last_name", "whatsapp", "email",
                "address", "total_amount", "items", "status"
            ])
            df.to_csv(self.data_file, index=False)

    def create_order(self, order_data: dict):
        df = pd.read_csv(self.data_file)
        
        # generate unique ID
        order_id = "ORD-" + str(uuid.uuid4())[:8].upper()
        
        new_row = {
            "order_id": order_id,
            "date": datetime.now().isoformat(),
            "first_name": order_data.get("first_name", ""),
            "last_name": order_data.get("last_name", ""),
            "whatsapp": order_data.get("whatsapp", ""),
            "email": order_data.get("email", ""),
            "address": order_data.get("address", ""),
            "total_amount": order_data.get("total_amount", 0),
            "items": order_data.get("items", ""),
            "status": "Pending"
        }
        
        new_df = pd.DataFrame([new_row])
        df = pd.concat([df, new_df], ignore_index=True)
        df.to_csv(self.data_file, index=False)
        return order_id
        
    def get_all_orders(self):
        df = pd.read_csv(self.data_file)
        
        # Parse missing values back to strings properly if needed
        # NaN becomes None in JS, but it's better to clean
        df = df.fillna("")
        
        # Sort so newest is at the top
        df = df.sort_values(by="date", ascending=False)
        
        return df.to_dict(orient="records")
        
    def update_status(self, order_id: str, new_status: str):
        df = pd.read_csv(self.data_file)
        mask = df["order_id"] == order_id
        if mask.any():
            idx = df[mask].index[0]
            df.loc[idx, "status"] = new_status
            df.to_csv(self.data_file, index=False)
            return True
        return False

    def delete_order(self, order_id: str):
        df = pd.read_csv(self.data_file)
        mask = df["order_id"] == order_id
        if mask.any():
            df = df[~mask]
            df.to_csv(self.data_file, index=False)
            return True
        return False
