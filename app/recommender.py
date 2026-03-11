import pandas as pd
import numpy as np
from sklearn.preprocessing import OneHotEncoder, StandardScaler
from sklearn.metrics.pairwise import cosine_similarity


class PlantRecommender:
    def __init__(self):
        self.df = pd.read_csv("data/plants.csv")
        self.prepare_data()

    # ==========================================================
    # DATA CLEANING + FEATURE ENGINEERING
    # ==========================================================
    def prepare_data(self):

        df = self.df.copy()

        # -----------------------------------
        # Remove Duplicate Plants
        # -----------------------------------
        df = df.drop_duplicates(subset=["plant_name"], keep="first")
        
        if "image_url" not in df.columns:
            df["image_url"] = ""
        else:
            df["image_url"] = df["image_url"].fillna("")

        # -----------------------------------
        # Clean Text Columns
        # -----------------------------------
        text_cols = [
            "category",
            "Type",
            "light_requirement",
            "maintenance_level",
            "growth_rate"
        ]

        for col in text_cols:
            df[col] = df[col].astype(str).str.lower().str.strip()

        # -----------------------------------
        # Convert Water Frequency → Numeric
        # Extract numbers from "2days", "7days"
        # -----------------------------------
        df["water_score"] = (
            df["water_frequency"]
            .str.extract(r"(\d+)")
            .astype(float)
        )

        # -----------------------------------
        # Maintenance Mapping
        # -----------------------------------
        maintenance_map = {
            "low": 3,
            "medium": 2,
            "high": 1
        }

        df["maintenance_score"] = df["maintenance_level"].map(maintenance_map)

        # Fill missing values safely
        df["water_score"] = df["water_score"].fillna(1)
        df["maintenance_score"] = df["maintenance_score"].fillna(1)

        # -----------------------------------
        # Sustainability Score (Improved)
        # -----------------------------------
        df["temp_range"] = df["temp_max"] - df["temp_min"]

        # Normalize temperature
        if df["temp_range"].max() != 0:
            temp_norm = df["temp_range"] / df["temp_range"].max()
        else:
            temp_norm = df["temp_range"]

        df["sustainability_score"] = (
            temp_norm * 5 +
            df["water_score"] +
            df["maintenance_score"]
        )

        df["sustainability_score"] = df["sustainability_score"].fillna(0)

        self.df = df

        # -----------------------------------
        # Feature Columns
        # -----------------------------------
        self.categorical_features = [
            "category",
            "Type",
            "light_requirement",
            "water_frequency",
            "maintenance_level",
            "growth_rate"
        ]

        self.numerical_features = [
            "temp_min",
            "temp_max",
            "price"
        ]

        # -----------------------------------
        # Encoder + Scaler
        # -----------------------------------
        self.encoder = OneHotEncoder(
            sparse_output=False,
            handle_unknown="ignore"
        )

        self.scaler = StandardScaler()

        encoded = self.encoder.fit_transform(df[self.categorical_features])
        scaled = self.scaler.fit_transform(df[self.numerical_features])

        # Combine Features
        self.feature_matrix = np.hstack([encoded, scaled])

    # ==========================================================
    # DATA MUTATION (ADD / DELETE)
    # ==========================================================
    def add_plant(self, plant_data: dict):
        """Append a new plant to the dataset and re-prepare the features."""
        # Convert dictionary to a DataFrame row
        new_row = pd.DataFrame([plant_data])
        
        # Concat original data with new row
        self.df = pd.concat([self.df, new_row], ignore_index=True)
        
        # Save back to CSV
        self.df.to_csv("data/plants.csv", index=False)
        
        # Re-run data prep (scaling, encoding, etc.)
        self.prepare_data()

    def delete_plant(self, plant_name: str):
        """Delete a plant by exact name match and re-prepare the features."""
        # Drop rows that match the exact plant name (case-insensitive)
        self.df = self.df[self.df["plant_name"].str.lower() != plant_name.lower()]
        
        # Save back to CSV
        self.df.to_csv("data/plants.csv", index=False)
        
        # Re-run data prep
        self.prepare_data()

    def edit_plant(self, original_plant_name: str, updated_data: dict):
        """Edit an existing plant by exact name match and re-prepare the features."""
        mask = self.df["plant_name"].str.lower() == original_plant_name.lower()
        if not mask.any():
            raise ValueError(f"Plant '{original_plant_name}' not found.")
            
        idx = self.df[mask].index[0]
        for key, value in updated_data.items():
            self.df.loc[idx, key] = value
            
        # Save back to CSV
        self.df.to_csv("data/plants.csv", index=False)
        
        # Re-run data prep
        self.prepare_data()

    # ==========================================================
    # RECOMMENDATION ENGINE
    # ==========================================================
    def recommend(self, user_input: dict, top_n=5):

        user_df = pd.DataFrame([user_input])

        # -----------------------------------
        # Ensure All Required Columns Exist
        # -----------------------------------
        for col in self.categorical_features:
            if col not in user_df.columns:
                user_df[col] = self.df[col].mode()[0]

        for col in self.numerical_features:
            if col not in user_df.columns:
                user_df[col] = self.df[col].median()

        # -----------------------------------
        # Normalize Text
        # -----------------------------------
        for col in self.categorical_features:
            user_df[col] = user_df[col].astype(str).str.lower().str.strip()

        # -----------------------------------
        # Transform User Input
        # -----------------------------------
        encoded = self.encoder.transform(user_df[self.categorical_features])
        scaled = self.scaler.transform(user_df[self.numerical_features])

        user_vector = np.hstack([encoded, scaled])

        # -----------------------------------
        # Similarity Calculation
        # -----------------------------------
        similarity = cosine_similarity(user_vector, self.feature_matrix)[0]

        # -----------------------------------
        # Final Hybrid Ranking
        # -----------------------------------
        max_sustain = self.df["sustainability_score"].max()
        if max_sustain == 0:
            max_sustain = 1

        final_score = (
    0.5 * similarity +
    0.2 * (self.df["expert_score"] / self.df["expert_score"].max()) +
    0.2 * (self.df["sustainability_score"] / max_sustain) +
    0.1 * (self.df["stock_quantity"] / self.df["stock_quantity"].max())
)

        top_indices = np.argsort(final_score)[-top_n:][::-1]

        results = self.df.iloc[top_indices].copy()
        
        # Scale expert score to out of 5 using global dataset max
        max_expert = self.df["expert_score"].max()
        if pd.isna(max_expert) or max_expert == 0:
            max_expert = 10.0
        results["expert_score"] = (results["expert_score"] / max_expert * 5.0).round(1)
        
        # Scale sustainability to an integer percentage (0-100%)
        results["sustainability_score"] = ((results["sustainability_score"] / max_sustain) * 100).fillna(0).astype(int)
        
        results = results[
            [
                "plant_name",
                "price",
                "expert_score",
                "sustainability_score",
                "image_url"
            ]
        ]

        return results.to_dict(orient="records")