import pandas as pd

def load_and_clean_data(path):
    df = pd.read_csv(path)

    # Fix typos
    df["maintenance_level"] = df["maintenance_level"].replace("medum", "medium")
    df["light_requirement"] = df["light_requirement"].replace("maximum", "high")
    df["category"] = df["category"].str.lower()
    df["Type"] = df["Type"].str.lower()

    # Convert water_frequency (e.g., "3days") → numeric
    df["water_frequency"] = df["water_frequency"].str.replace("days", "")
    df["water_frequency"] = df["water_frequency"].str.replace("day", "")
    df["water_frequency"] = df["water_frequency"].astype(int)

    # Convert maintenance_level to numeric
    maintenance_map = {"low": 1, "medium": 2, "high": 3}
    df["maintenance_numeric"] = df["maintenance_level"].map(maintenance_map)

    # Encode growth_rate
    growth_map = {"slow": 1, "medium": 2, "fast": 3}
    df["growth_numeric"] = df["growth_rate"].map(growth_map)

    # Temperature range feature
    df["temp_range"] = df["temp_max"] - df["temp_min"]

    return df