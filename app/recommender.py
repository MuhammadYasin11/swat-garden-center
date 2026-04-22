import pandas as pd
import numpy as np
from sklearn.preprocessing import OneHotEncoder, StandardScaler
from sklearn.metrics.pairwise import cosine_similarity
from sqlalchemy.orm import Session
from app import models

class PlantRecommender:
    def __init__(self):
        self.df = pd.DataFrame()
        
        self.categorical_features = [
            "category",
            "type",
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
        
        self.encoder = OneHotEncoder(
            sparse_output=False,
            handle_unknown="ignore"
        )
        self.scaler = StandardScaler()
        self.feature_matrix = None

    def load_from_db(self, db: Session):
        plants = db.query(models.Plant).all()
        data = []
        for p in plants:
            # Fallback to placeholder.png if missing
            img = p.image_url.strip() if p.image_url else ""
            if not img:
                img = "placeholder.png"
            
            data.append({
                "name": p.name,
                "category": p.category,
                "type": p.type,
                "light_requirement": p.light_requirement or "medium",
                "water_frequency": p.water_frequency or "2days",
                "maintenance_level": p.maintenance_level or "medium",
                "growth_rate": p.growth_rate or "medium",
                "temp_min": p.temp_min or 5,
                "temp_max": p.temp_max or 45,
                "price": p.price or 0.0,
                "stock_quantity": p.stock or 0,
                "expert_score": p.ai_score or 0.0,
                "image_url": img
            })
        self.df = pd.DataFrame(data)
        self.prepare_data()

    def prepare_data(self):
        if self.df.empty:
            return

        df = self.df.copy()

        df = df.drop_duplicates(subset=["name"], keep="first")
        
        if "image_url" not in df.columns:
            df["image_url"] = "placeholder.png"
        else:
            df["image_url"] = df["image_url"].fillna("placeholder.png")
            # Enforce that empty strings become placeholders
            df.loc[df["image_url"] == "", "image_url"] = "placeholder.png"

        text_cols = [
            "category", "type", "light_requirement", "maintenance_level", "growth_rate"
        ]

        for col in text_cols:
            df[col] = df[col].astype(str).str.lower().str.strip()

        df["water_score"] = (
            df["water_frequency"]
            .str.extract(r"(\d+)")
            .astype(float)
        )

        maintenance_map = {
            "low": 3,
            "medium": 2,
            "high": 1
        }
        df["maintenance_score"] = df["maintenance_level"].map(maintenance_map)

        df["water_score"] = df["water_score"].fillna(1)
        df["maintenance_score"] = df["maintenance_score"].fillna(1)

        df["temp_range"] = df["temp_max"] - df["temp_min"]

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

        encoded = self.encoder.fit_transform(df[self.categorical_features])
        scaled = self.scaler.fit_transform(df[self.numerical_features])

        self.feature_matrix = np.hstack([encoded, scaled])

    def recommend(self, user_input: dict, top_n=5):
        if self.df.empty:
            return []

        user_df = pd.DataFrame([user_input])

        for col in self.categorical_features:
            if col not in user_df.columns:
                user_df[col] = self.df[col].mode()[0]

        for col in self.numerical_features:
            if col not in user_df.columns:
                user_df[col] = self.df[col].median()

        for col in self.categorical_features:
            user_df[col] = user_df[col].astype(str).str.lower().str.strip()

        encoded = self.encoder.transform(user_df[self.categorical_features])
        scaled = self.scaler.transform(user_df[self.numerical_features])

        user_vector = np.hstack([encoded, scaled])

        similarity = cosine_similarity(user_vector, self.feature_matrix)[0]

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
        
        max_expert = self.df["expert_score"].max()
        if pd.isna(max_expert) or max_expert == 0:
            max_expert = 10.0
        results["expert_score"] = (results["expert_score"] / max_expert * 5.0).round(1)
        
        results["sustainability_score"] = ((results["sustainability_score"] / max_sustain) * 100).fillna(0).astype(int)
        
        results = results[
            [
                "name",
                "category",
                "type",
                "price",
                "expert_score",
                "sustainability_score",
                "image_url"
            ]
        ]

        return results.to_dict(orient="records")