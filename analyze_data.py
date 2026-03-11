import pandas as pd

df = pd.read_csv("data/plants.csv")

print("First 5 rows:\n")
print(df.head())

print("\nColumn Names:\n")
print(df.columns)

print("\nData Info:\n")
print(df.info())

print("\nMissing Values:\n")
print(df.isnull().sum())