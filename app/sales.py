import pandas as pd
import os
import uuid
from datetime import datetime

class PhysicalSalesManager:
    def __init__(self, data_file="data/physical_sales.csv"):
        self.data_file = data_file
        self._ensure_file_exists()
        
    def _ensure_file_exists(self):
        if not os.path.exists(self.data_file):
            df = pd.DataFrame(columns=[
                "id", "date", "total_sale", "expense", "net_sale", "description"
            ])
            df.to_csv(self.data_file, index=False)

    def get_all_sales(self):
        df = pd.read_csv(self.data_file)
        
        # Clean NaNs
        df = df.fillna("")
        
        # Sort so newest is at the top
        df = df.sort_values(by="date", ascending=False)
        
        return df.to_dict(orient="records")

    def add_sale(self, sale_data: dict):
        df = pd.read_csv(self.data_file)
        
        sale_id = "SALE-" + str(uuid.uuid4())[:8].upper()
        
        total_sale = float(sale_data.get("total_sale", 0))
        expense = float(sale_data.get("expense", 0))
        net_sale = total_sale - expense
        
        new_row = {
            "id": sale_id,
            "date": sale_data.get("date", datetime.now().strftime("%Y-%m-%d")),
            "total_sale": total_sale,
            "expense": expense,
            "net_sale": net_sale,
            "description": sale_data.get("description", "")
        }
        
        new_df = pd.DataFrame([new_row])
        df = pd.concat([df, new_df], ignore_index=True)
        df.to_csv(self.data_file, index=False)
        return True, "Physical sale recorded successfully."

    def update_sale(self, sale_id: str, sale_data: dict):
        df = pd.read_csv(self.data_file)
        if sale_id not in df["id"].values:
            return False, "Sale record not found."
        
        idx = df.index[df["id"] == sale_id].tolist()[0]
        
        total_sale = float(sale_data.get("total_sale", df.at[idx, "total_sale"]))
        expense = float(sale_data.get("expense", df.at[idx, "expense"]))
        net_sale = total_sale - expense
        
        df.at[idx, "date"] = sale_data.get("date", df.at[idx, "date"])
        df.at[idx, "total_sale"] = total_sale
        df.at[idx, "expense"] = expense
        df.at[idx, "net_sale"] = net_sale
        df.at[idx, "description"] = sale_data.get("description", df.at[idx, "description"])
        
        df.to_csv(self.data_file, index=False)
        return True, "Physical sale updated successfully."

    def delete_sale(self, sale_id: str):
        df = pd.read_csv(self.data_file)
        if sale_id not in df["id"].values:
            return False, "Sale record not found."
            
        df = df[df["id"] != sale_id]
        df.to_csv(self.data_file, index=False)
        return True, "Physical sale deleted successfully."
