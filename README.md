# 🎓 Student Engagement Prediction System

An AI-powered early warning system for higher education institutions in India to predict and prevent student academic disengagement.

## 🚀 **INTEGRATED FULL-STACK SYSTEM**

This project now includes a complete **React frontend** integrated with the **Flask backend** and **ML pipeline**!

### **🎯 Core Problem:**
- 25% of Indian college students struggle to complete degrees on time
- 22-28% yearly disengagement rate
- Need for early detection instead of reactive monitoring

### **✅ Complete Implementation:**
- ✅ **React Frontend** - Modern, responsive dashboard with shadcn/ui
- ✅ **Flask Backend** - REST API with all ML endpoints
- ✅ **ML Pipeline** - Complete training and prediction system
- ✅ **SHAP Integration** - Explainable AI with feature importance
- ✅ **Batch Processing** - CSV upload for multiple predictions
- ✅ **Email Alerts** - Automated notifications system
- ✅ **Advanced Analytics** - Interactive charts and insights

---

## 🏗️ **Project Structure**

```
student-engagement-predictor/
├── 🎨 shiksha-pulse-main/     # React Frontend (shadcn/ui + TypeScript)
│   ├── src/
│   │   ├── components/        # UI components
│   │   ├── pages/            # Dashboard, Students, Analytics, etc.
│   │   └── lib/              # API services and utilities
│   ├── public/               # Static assets
│   └── dist/                # Built frontend (generated)
├── 🌐 dist/                  # Flask serves React build from here
├── 🤖 models/               # Trained ML models
├── 📊 data/                 # Processed datasets
├── 📤 uploads/              # File uploads for batch processing
├── 🌐 templates/            # Flask HTML templates
├── 📚 train_model.py        # ML training pipeline
├── 🌐 app.py               # Flask API application
├── 📦 requirements.txt      # Python dependencies
└── 📖 README.md            # Documentation
```

---

## 🚀 **Quick Start**

### **1. One-Command Setup**
```bash
# Install everything and build the complete system
python setup_complete.py
```

### **2. Manual Setup**
```bash
# Install Python dependencies
pip install -r requirements.txt

# Install React dependencies
cd shiksha-pulse-main && npm install
cd ..

# Build React frontend
npm run build

# Train ML model
python train_model.py

# Launch complete system
python app.py
```

### **3. Development Mode**
```bash
# Frontend development (with hot reload)
cd shiksha-pulse-main && npm run dev

# Backend development (in another terminal)
python app.py
```

---

## 🎯 **Features Overview**

### **📊 Dashboard**
- Real-time KPIs and metrics
- Risk distribution pie charts
- Department-wise analysis
- Engagement trends visualization

### **🔍 Student Management**
- Search and filter students
- Individual student profiles
- Risk level indicators
- Batch operations

### **📈 Analytics**
- Interactive Plotly charts
- Correlation heatmaps
- Performance insights
- Risk factor analysis

### **📤 Batch Processing**
- CSV/Excel file uploads
- Multiple student predictions
- Export results
- Drag & drop interface

### **🔬 Explainable AI**
- SHAP value analysis
- Feature importance visualization
- Model decision explanations
- Individual student insights

### **📧 Email Alerts**
- Automated notifications
- Customizable templates
- High-risk student alerts
- Integration ready

---

## 🌐 **API Endpoints**

### **Frontend Routes (React)**
- `GET /` - Main dashboard
- `GET /students` - Student management
- `GET /analytics` - Analytics dashboard
- `GET /simulation` - What-if scenarios

### **Backend API (Flask)**
- `GET /api/dashboard` - Dashboard KPIs
- `GET /api/students` - Student list with filtering
- `GET /api/student/{id}` - Individual student details
- `POST /api/predict` - Single predictions
- `POST /api/simulate` - Scenario analysis
- `POST /api/upload` - Batch file processing
- `GET /api/shap_analysis/{id}` - SHAP explanations
- `GET /api/advanced_analytics` - Interactive charts
- `POST /api/send_alert` - Email notifications
- `GET /api/model_performance` - Model metrics

---

## 🛠️ **Development Commands**

```bash
# Complete system setup
python setup_complete.py

# Install all dependencies
npm run install:all

# Build frontend for Flask
npm run build

# Train ML model
npm run train

# Start development server
npm run dev

# Clean build artifacts
npm run clean
```

---

## 📋 **System Requirements**

### **Python (Backend)**
- Python 3.8+
- pip for package management
- 8GB+ RAM recommended

### **Node.js (Frontend)**
- Node.js 18+
- npm or yarn
- 4GB+ RAM recommended

---

## 🚨 **Common Issues & Solutions**

1. **Frontend not loading**: Run `npm run build` to rebuild React
2. **API connection errors**: Ensure Flask is running on port 5000
3. **Missing dependencies**: Run `npm run install:all`
4. **Model not found**: Run `python train_model.py` to train

---

## 🎯 **Ready to Launch!**

Your complete **Student Engagement Prediction System** is ready with:

✅ **All Bonus Features Implemented**  
✅ **React Frontend Integrated**  
✅ **Flask Backend with Full API**  
✅ **ML Pipeline with SHAP**  
✅ **Batch Processing & Email Alerts**  
✅ **Advanced Analytics & Visualizations**

**Launch the complete system:**
```bash
python setup_complete.py
# or
python app.py
```

**Visit:** http://localhost:5000

---

**🎓 Built for Indian Higher Education | Complete AI-Powered Solution**
