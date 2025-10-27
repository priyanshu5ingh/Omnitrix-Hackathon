#!/usr/bin/env python3
"""
Setup script for Student Engagement Prediction System
Installs dependencies and verifies project structure
"""

import os
import sys
import subprocess
import importlib.util

def run_command(command, description):
    """Run a shell command and return success status"""
    print(f"🔧 {description}...")
    try:
        result = subprocess.run(command, shell=True, check=True,
                              capture_output=True, text=True)
        print(f"✅ {description} completed successfully")
        return True
    except subprocess.CalledProcessError as e:
        print(f"❌ {description} failed: {e}")
        print(f"Error output: {e.stderr}")
        return False

def check_python_package(package_name):
    """Check if a Python package is installed"""
    try:
        importlib.import_module(package_name)
        return True
    except ImportError:
        return False

def install_python_dependencies():
    """Install Python dependencies"""
    print("\n📦 Installing Python dependencies...")

    required_packages = [
        'pandas', 'numpy', 'scikit-learn', 'xgboost',
        'flask', 'flask-cors', 'joblib', 'shap',
        'matplotlib', 'seaborn', 'openpyxl'
    ]

    missing_packages = []
    for package in required_packages:
        if not check_python_package(package):
            missing_packages.append(package)

    if missing_packages:
        print(f"Installing missing packages: {', '.join(missing_packages)}")
        success = run_command(
            f"pip install {' '.join(missing_packages)}",
            "Installing missing Python packages"
        )
        if not success:
            print("⚠️  Some packages may need to be installed manually")
    else:
        print("✅ All Python dependencies already installed")

def check_file_structure():
    """Verify project file structure"""
    print("\n📁 Checking project structure...")

    required_files = [
        'requirements.txt',
        'app.py',
        'train_model.py',
        'README.md',
        'templates/index.html'
    ]

    required_dirs = [
        'models',
        'data',
        'templates',
        'static'
    ]

    missing_files = []
    missing_dirs = []

    for file in required_files:
        if not os.path.exists(file):
            missing_files.append(file)

    for dir_name in required_dirs:
        if not os.path.exists(dir_name):
            missing_dirs.append(dir_name)

    if missing_files:
        print(f"⚠️  Missing files: {missing_files}")
    else:
        print("✅ All required files present")

    if missing_dirs:
        print(f"⚠️  Missing directories: {missing_dirs}")
        print("Creating missing directories...")
        for dir_name in missing_dirs:
            os.makedirs(dir_name, exist_ok=True)
        print("✅ Directories created")
    else:
        print("✅ All required directories present")

def check_dataset():
    """Check if dataset file exists"""
    print("\n📊 Checking dataset...")

    dataset_files = ['Dataset.xlsx', 'Dataset.csv']

    dataset_found = False
    for file in dataset_files:
        if os.path.exists(file):
            print(f"✅ Dataset found: {file}")
            dataset_found = True
            break

    if not dataset_found:
        print("⚠️  Dataset not found. Expected: Dataset.xlsx or Dataset.csv")
        print("Please ensure your dataset is in the project directory")

def test_flask_app():
    """Test if Flask app can start (basic test)"""
    print("\n🌐 Testing Flask application...")

    try:
        # Try to import Flask modules
        import flask
        import flask_cors
        print("✅ Flask modules imported successfully")
        return True
    except ImportError as e:
        print(f"❌ Flask import failed: {e}")
        print("Please run: pip install flask flask-cors")
        return False

def main():
    """Main setup function"""
    print("🎓 Student Engagement Prediction System Setup")
    print("=" * 50)

    # Check Python version
    print(f"🐍 Python version: {sys.version}")

    # Install dependencies
    install_python_dependencies()

    # Check file structure
    check_file_structure()

    # Check dataset
    check_dataset()

    # Test Flask
    test_flask_app()

    print("\n" + "=" * 50)
    print("🎉 Setup complete!")
    print("\n📋 Next steps:")
    print("1. Generate frontend using Lovable with the provided prompt")
    print("2. Run: python train_model.py (to train the ML model)")
    print("3. Run: python app.py (to start the dashboard)")
    print("4. Visit: http://localhost:5000")

    print("\n🔗 API Endpoints available:")
    print("• GET /api/dashboard - Dashboard metrics")
    print("• GET /api/students - Student list")
    print("• POST /api/predict - Make predictions")
    print("• GET /api/analytics - Analytics data")

    print("\n📖 For more information, see README.md")

if __name__ == "__main__":
    main()
