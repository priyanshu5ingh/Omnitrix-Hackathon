# 🎓 Student Engagement Prediction System

An AI-powered early warning system for higher education institutions in India to predict and prevent student academic disengagement.

## 🚀 Problem Statement

Across higher education institutions in India, **25% of students struggle to complete their degrees on time** due to factors like academic pressure, poor attendance, financial instability, and lack of personalized support. Traditional monitoring systems are reactive, identifying issues only after performance declines significantly.

This system uses **Machine Learning** to:
- Predict student engagement risk scores
- Provide early warning indicators
- Enable data-driven interventions
- Support institutional decision-making

## 📋 Expected Deliverables

✅ **Cleaned dataset** (CSV format)
✅ **Trained ML model** (.pkl format)
✅ **Frontend dashboard** (Flask/Streamlit)
✅ **Documentation** (README)
✅ **Optional**: Presentation and bonus features

## 🎯 Key Features

### Core Features
- **Predictive Analytics**: ML model predicts student engagement risk
- **Interactive Dashboard**: Real-time KPIs and visualizations
- **Student Search & Analysis**: Filterable student database
- **Risk Assessment**: Individual student risk profiling
- **What-if Simulations**: Test intervention scenarios

### Bonus Features
- **SHAP Integration**: Explainable AI for predictions
- **Batch Processing**: CSV upload for multiple predictions
- **API Endpoints**: RESTful API for integrations
- **Advanced Analytics**: Detailed performance insights

## 🏗️ Project Structure

```
student-engagement-predictor/
├── 📊 data/                    # Processed datasets
├── 🤖 models/                  # Trained ML models
├── 🌐 templates/               # HTML templates
├── ⚙️ static/                  # CSS, JS, assets
├── 📚 notebooks/               # Jupyter notebooks
├── 🔧 train_model.py          # Model training script
├── 🌐 app.py                  # Flask API application
├── 📦 requirements.txt         # Python dependencies
├── 📦 package.json            # Node.js dependencies (if needed)
└── 📖 README.md               # Documentation
```

## 🚀 Quick Start

### 1. Setup Environment

```bash
# Clone or navigate to project directory
cd student-engagement-predictor

# Install Python dependencies
pip install -r requirements.txt

# Install Node.js dependencies (if using frontend features)
npm install
```

### 2. Train the Model

```bash
# Run the training pipeline
python train_model.py
```

This will:
- Load and analyze your dataset
- Preprocess the data
- Train the ML model
- Save the model and preprocessing objects
- Generate feature importance plots

### 3. Launch the Dashboard

```bash
# Start the Flask API server
python app.py
```

Visit: **http://localhost:5000**

## 📊 API Endpoints

### Dashboard & Analytics
- `GET /` - Main dashboard interface
- `GET /api/dashboard` - Dashboard KPIs and metrics
- `GET /api/analytics` - Detailed analytics data

### Student Management
- `GET /api/students` - List students with filtering
- `GET /api/student/{id}` - Individual student details

### Predictions
- `POST /api/predict` - Single student prediction
- `POST /api/simulate` - What-if scenario analysis

## 🧠 Machine Learning Pipeline

### 1. Data Preprocessing
- **Missing Value Handling**: Median/mode imputation
- **Categorical Encoding**: Label encoding for categorical features
- **Feature Engineering**: Interaction features, performance indicators
- **Scaling**: StandardScaler for numerical features

### 2. Model Architecture
- **Algorithm**: XGBoost Classifier (default)
- **Features**: Academic, behavioral, and socio-economic indicators
- **Target**: Risk levels (Low, Medium, High)
- **Evaluation**: Cross-validation, accuracy, F1-score

### 3. Model Performance
- **Training Accuracy**: ~85-95% (varies by dataset)
- **Cross-validation**: 5-fold validation
- **Feature Importance**: SHAP analysis available

## 🎨 Frontend Dashboard

### Core Components
1. **Dashboard Overview**
   - Total students, risk distribution
   - Engagement trends, performance metrics
   - Department-wise analysis

2. **Student Search**
   - Filterable student list
   - Risk indicators, quick actions
   - Export capabilities

3. **Student Details**
   - Individual risk profile
   - Feature importance visualization
   - Recommendation engine

4. **Simulation Panel**
   - Interactive scenario testing
   - Real-time prediction updates
   - Impact analysis

## 🔧 Customization

### Model Configuration
Edit `train_model.py`:
```python
# Change model type
predictor = StudentEngagementPredictor()
predictor.train_model(processed_df, model_type='randomforest')

# Modify risk thresholds
df['risk_level'] = pd.qcut(df['engagement_score'], q=3,
                          labels=['Low', 'Medium', 'High'])
```

### Dashboard Customization
- Modify `templates/index.html` for UI changes
- Update `app.py` for new API endpoints
- Customize feature importance in `get_feature_importance()`

## 📈 Performance Metrics

### Expected Results
- **Early Warning Accuracy**: 80-90%
- **False Positive Rate**: <15%
- **Student Coverage**: 100% of enrolled students
- **Prediction Speed**: <100ms per student

### Model Interpretability
- **SHAP Values**: Feature contribution analysis
- **Feature Importance**: Top contributing factors
- **Confidence Scores**: Prediction certainty levels

## 🚨 Troubleshooting

### Common Issues

1. **Model Loading Error**
   ```bash
   # Ensure model files exist
   ls models/
   # Retrain if necessary
   python train_model.py
   ```

2. **Missing Dependencies**
   ```bash
   pip install -r requirements.txt
   ```

3. **Dataset Issues**
   - Check column names in `Dataset.xlsx`
   - Ensure target variable exists
   - Verify data quality

### Support
- Check console logs for detailed error messages
- Verify file paths and permissions
- Ensure sufficient memory for large datasets

## 📝 Development Notes

### Data Requirements
- **Minimum Records**: 1000 students
- **Required Features**: Academic performance, attendance
- **Optional Features**: Socio-economic indicators
- **Format**: Excel (.xlsx) or CSV

### Hardware Requirements
- **RAM**: 8GB+ recommended
- **Storage**: 2GB+ for models and data
- **CPU**: Multi-core for faster training

## 🎯 Future Enhancements

### Planned Features
- [ ] Real-time data integration
- [ ] Multi-institutional benchmarking
- [ ] Advanced recommendation engine
- [ ] Mobile application
- [ ] Integration with LMS systems

### Research Directions
- [ ] Deep learning approaches
- [ ] Temporal prediction models
- [ ] Multi-modal data integration
- [ ] Causal inference analysis

## 📄 License

This project is developed for educational institutions and research purposes.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Add tests and documentation
4. Submit a pull request

## 📞 Contact

For questions, suggestions, or collaborations:
- Project Lead: [Your Name]
- Institution: [Your Institution]
- Email: [your.email@domain.com]

---

**Built with ❤️ for Indian Higher Education | Reducing Academic Disengagement through AI**
