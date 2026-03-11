import pandas as pd
import os
import json

class ToolManager:
    def __init__(self, data_path="data/tools.csv"):
        self.data_path = data_path
        # Ensure the file exists
        if not os.path.exists(self.data_path):
            df = pd.DataFrame(columns=["name", "category", "type", "price", "stock_quantity", "expert_score", "image_url"])
            df.to_csv(self.data_path, index=False)

    def get_all_tools(self):
        try:
            df = pd.read_csv(self.data_path)
            # Replace NaNs with empty strings or None for JSON serialization
            df = df.fillna("")
            return df.to_dict(orient="records")
        except Exception as e:
            print(f"Error reading tools: {e}")
            return []

    def add_tool(self, tool_data: dict):
        try:
            df = pd.read_csv(self.data_path)
            
            # Check if exists
            if not df[df['name'] == tool_data['name']].empty:
                return False, "Tool with this name already exists"

            # Create a new DataFrame for the single row and concatenate
            new_row_df = pd.DataFrame([tool_data])
            df = pd.concat([df, new_row_df], ignore_index=True)
            df.to_csv(self.data_path, index=False)
            return True, "Tool added successfully"
        except Exception as e:
            print(f"Error adding tool: {e}")
            return False, str(e)

    def edit_tool(self, original_name: str, new_tool_data: dict):
        try:
            df = pd.read_csv(self.data_path)
            
            # Find the tool
            idx = df.index[df['name'] == original_name]
            if len(idx) == 0:
                return False, "Tool not found"
            
            # If changing name, check if new name already exists
            if original_name != new_tool_data['name'] and not df[df['name'] == new_tool_data['name']].empty:
                return False, "A tool with the new name already exists"

            # Update the row
            for key, value in new_tool_data.items():
                if key in df.columns:
                    df.loc[idx, key] = value

            df.to_csv(self.data_path, index=False)
            return True, "Tool updated successfully"
        except Exception as e:
            print(f"Error editing tool: {e}")
            return False, str(e)

    def delete_tool(self, tool_name: str):
        try:
            df = pd.read_csv(self.data_path)
            
            if df[df['name'] == tool_name].empty:
                return False, "Tool not found"

            # Remove the row
            df = df[df['name'] != tool_name]
            df.to_csv(self.data_path, index=False)
            return True, "Tool deleted successfully"
        except Exception as e:
            print(f"Error deleting tool: {e}")
            return False, str(e)

    def bulk_import_tools(self, df_new: pd.DataFrame):
        try:
            df = pd.read_csv(self.data_path)
            
            # Merge with existing, keeping the latest duplicates based on tool name
            df = pd.concat([df, df_new], ignore_index=True)
            df.drop_duplicates(subset=["name"], keep="last", inplace=True)
            
            df.to_csv(self.data_path, index=False)
            return True, f"Successfully imported {len(df_new)} tools."
        except Exception as e:
            print(f"Error during bulk import of tools: {e}")
            return False, str(e)
