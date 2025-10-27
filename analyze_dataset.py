import pandas as pd
import numpy as np
from pathlib import Path

# Read the dataset
print("🔍 Analyzing Student Engagement Dataset")
print("=" * 50)

try:
    # Read Excel file
    df = pd.read_excel('Dataset.xlsx')

    print(f"📊 Dataset Shape: {df.shape[0]} rows × {df.shape[1]} columns")
    print("\n📋 Column Information:")
    print("-" * 30)

    # Basic info about columns
    for col in df.columns:
        print(f"• {col}: {df[col].dtype}")
        if df[col].dtype == 'object':
            unique_count = df[col].nunique()
            print(f"  - Unique values: {unique_count}")
            if unique_count <= 10:  # Show values for categorical with few unique values
                print(f"  - Values: {df[col].unique()}")
        else:
            print(f"  - Range: {df[col].min()} to {df[col].max()}")
            print(f"  - Mean: {df[col].mean():.2f}")
        print()

    print("📈 Missing Values Analysis:")
    print("-" * 30)
    missing_info = df.isnull().sum()
    if missing_info.sum() > 0:
        print(missing_info[missing_info > 0])
    else:
        print("✅ No missing values found!")

    print("\n🎯 Target Variable Analysis:")
    print("-" * 30)
    # Look for potential target variables (engagement, dropout, performance indicators)
    potential_targets = [col for col in df.columns if any(word in col.lower() for word in
                        ['engage', 'drop', 'risk', 'performance', 'gpa', 'grade', 'status', 'complete'])]
    if potential_targets:
        print("Potential target variables found:")
        for target in potential_targets:
            print(f"• {target}")
    else:
        print("No obvious target variables found. Manual inspection needed.")

    print("\n🔧 Feature Categories:")
    print("-" * 30)
    # Categorize features
    categorical_cols = df.select_dtypes(include=['object']).columns.tolist()
    numerical_cols = df.select_dtypes(include=[np.number]).columns.tolist()

    print(f"Categorical features ({len(categorical_cols)}):")
    for col in categorical_cols:
        print(f"• {col}")

    print(f"\nNumerical features ({len(numerical_cols)}):")
    for col in numerical_cols:
        print(f"• {col}")

    print("\n📊 Sample Data:")
    print("-" * 30)
    print(df.head())

    print("\n💾 Dataset saved to: dataset_analysis.csv")
    df.to_csv('dataset_analysis.csv', index=False)
    print("✅ Analysis complete!")

except Exception as e:
    print(f"❌ Error reading dataset: {e}")
    print("Please ensure the Excel file is accessible and not corrupted.")
