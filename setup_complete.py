#!/usr/bin/env python3
"""
Complete setup script for Student Engagement Prediction System
Handles both backend and frontend setup and integration
"""

import os
import sys
import subprocess
import importlib.util
import shutil
from pathlib import Path

def run_command(command, description, cwd=None):
    """Run a shell command and return success status"""
    print(f"🔧 {description}...")
    try:
        result = subprocess.run(command, shell=True, check=True,
                              capture_output=True, text=True, cwd=cwd)
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
        'matplotlib', 'seaborn', 'openpyxl', 'plotly'
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

def install_node_dependencies():
    """Install Node.js dependencies for the React frontend"""
    print("\n📦 Installing Node.js dependencies...")

    frontend_dir = "shiksha-pulse-main"

    if not os.path.exists(frontend_dir):
        print(f"❌ Frontend directory '{frontend_dir}' not found!")
        return False

    # Check if node_modules exists
    node_modules_path = os.path.join(frontend_dir, "node_modules")
    if not os.path.exists(node_modules_path):
        print(f"Installing dependencies in {frontend_dir}...")
        success = run_command("npm install", "Installing React dependencies", cwd=frontend_dir)
        if not success:
            print("⚠️  Node.js dependencies installation failed")
            return False
    else:
        print("✅ Node.js dependencies already installed")

    return True

def build_react_frontend():
    """Build the React frontend"""
    print("\n🏗️  Building React frontend...")

    frontend_dir = "shiksha-pulse-main"

    if not os.path.exists(frontend_dir):
        print(f"❌ Frontend directory '{frontend_dir}' not found!")
        return False

    # Build the React app
    success = run_command("npm run build", "Building React frontend", cwd=frontend_dir)
    if not success:
        print("⚠️  React build failed")
        return False

    # Check if dist directory was created
    dist_path = "dist"
    if not os.path.exists(dist_path):
        print("❌ Build output directory not found!")
        return False

    print("✅ React frontend built successfully")
    return True

def check_file_structure():
    """Verify project file structure"""
    print("\n📁 Checking project structure...")

    required_files = [
        'requirements.txt',
        'app.py',
        'train_model.py',
        'README.md'
    ]

    required_dirs = [
        'models',
        'data',
        'templates',
        'shiksha-pulse-main'
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

    # Check frontend structure
    frontend_dir = "shiksha-pulse-main"
    if os.path.exists(frontend_dir):
        frontend_files = ['package.json', 'src', 'public']
        for file in frontend_files:
            if not os.path.exists(os.path.join(frontend_dir, file)):
                print(f"⚠️  Missing frontend file: {file}")

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
    print("🎓 Student Engagement Prediction System - Complete Setup")
    print("=" * 60)

    # Check Python version
    print(f"🐍 Python version: {sys.version}")

    # Check file structure
    check_file_structure()

    # Check dataset
    check_dataset()

    # Install Python dependencies
    install_python_dependencies()

    # Install Node.js dependencies
    install_node_dependencies()

    # Build React frontend
    build_react_frontend()

    # Test Flask
    test_flask_app()

    print("\n" + "=" * 60)
    print("🎉 Setup complete!")
    print("\n📋 Next steps:")
    print("1. Train your model: python train_model.py")
    print("2. Start the complete system: python app.py")
    print("3. Visit: http://localhost:5000")
    print("\n🔗 Available features:")
    print("• 📊 Dashboard with real-time analytics")
    print("• 🔍 Student search and management")
    print("• 📈 Advanced analytics with charts")
    print("• 📤 Batch upload for predictions")
    print("• 🔬 SHAP explainable AI")
    print("• 📧 Email alerts system")
    print("• 🎯 Model performance metrics")

    print("\n📖 For detailed instructions, see README.md")
    print("\n🚀 Ready to predict student engagement!")

if __name__ == "__main__":
    main()
