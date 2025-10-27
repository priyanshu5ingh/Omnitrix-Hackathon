from flask import Flask, jsonify, request, render_template, send_file, send_from_directory
from flask_cors import CORS
import pandas as pd
import numpy as np
import joblib
import os
from datetime import datetime
import json
import shap
import matplotlib.pyplot as plt
import seaborn as sns
import io
import base64
from werkzeug.utils import secure_filename
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import plotly.graph_objects as go
import plotly.express as px
from plotly.utils import PlotlyJSONEncoder

app = Flask(__name__, static_folder='dist', static_url_path='')
CORS(app)  # Enable CORS for frontend integration

# Configuration
app.config['UPLOAD_FOLDER'] = 'uploads'
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16MB max file size
app.config['ALLOWED_EXTENSIONS'] = {'csv', 'xlsx', 'xls'}

# Email configuration (update with your settings)
EMAIL_CONFIG = {
    'smtp_server': 'smtp.gmail.com',
    'smtp_port': 587,
    'sender_email': 'your-email@gmail.com',
    'sender_password': 'your-app-password'
}

# Model and preprocessing objects (to be loaded)
model = None
feature_columns = None
scaler = None

# Create necessary directories
os.makedirs('uploads', exist_ok=True)
os.makedirs('static/charts', exist_ok=True)

@app.route('/')
def serve_react():
    """Serve the React frontend"""
    return send_from_directory(app.static_folder, 'index.html')

@app.route('/<path:path>')
def serve_static_files(path):
    """Serve static files and handle React routing"""
    # Try to serve the file directly
    try:
        return send_from_directory(app.static_folder, path)
    except:
        # If file doesn't exist, serve index.html for React routing
        return send_from_directory(app.static_folder, 'index.html')

@app.route('/upload')
def upload_page():
    """Serve the upload page"""
    return render_template('upload.html')

@app.route('/api/dashboard')
def dashboard():
    """Get dashboard KPIs and metrics"""
    try:
        # Load processed data for dashboard metrics
        df = pd.read_csv('data/processed_data.csv')

        # Calculate KPIs
        total_students = len(df)
        high_risk = len(df[df['risk_level'] == 'High'])
        medium_risk = len(df[df['risk_level'] == 'Medium'])
        low_risk = len(df[df['risk_level'] == 'Low'])

        kpis = {
            'total_students': total_students,
            'high_risk': high_risk,
            'medium_risk': medium_risk,
            'low_risk': low_risk,
            'disengagement_rate': round((high_risk / total_students) * 100, 2),
            'avg_engagement_score': round(df['engagement_score'].mean(), 2)
        }

        return jsonify(kpis)

    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/students')
def get_students():
    """Get all students with filtering and pagination"""
    try:
        df = pd.read_csv('data/processed_data.csv')

        # Get query parameters
        search = request.args.get('search', '')
        risk_filter = request.args.get('risk', '')
        department = request.args.get('department', '')
        page = int(request.args.get('page', 1))
        per_page = int(request.args.get('per_page', 20))

        # Apply filters
        if search:
            df = df[df['name'].str.contains(search, case=False, na=False) |
                   df['student_id'].str.contains(search, case=False, na=False)]

        if risk_filter:
            df = df[df['risk_level'] == risk_filter]

        if department:
            df = df[df['department'] == department]

        # Pagination
        start_idx = (page - 1) * per_page
        end_idx = start_idx + per_page
        total_pages = (len(df) + per_page - 1) // per_page

        students = df.iloc[start_idx:end_idx].to_dict('records')

        return jsonify({
            'students': students,
            'total_pages': total_pages,
            'current_page': page,
            'total_students': len(df)
        })

    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/student/<student_id>')
def get_student(student_id):
    """Get detailed information for a specific student"""
    try:
        df = pd.read_csv('data/processed_data.csv')
        student = df[df['student_id'] == student_id]

        if student.empty:
            return jsonify({'error': 'Student not found'}), 404

        student_data = student.iloc[0].to_dict()

        # Get feature importance if available
        if model and hasattr(model, 'feature_importances_'):
            # Calculate SHAP values or feature importance
            feature_importance = get_feature_importance(student_data)
            student_data['feature_importance'] = feature_importance

        return jsonify(student_data)

    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/predict', methods=['POST'])
def predict():
    """Make prediction for new student data"""
    try:
        data = request.get_json()

        if not data:
            return jsonify({'error': 'No data provided'}), 400

        # Convert to DataFrame
        input_df = pd.DataFrame([data])

        # Preprocess the data (same preprocessing as training)
        processed_data = preprocess_data(input_df)

        # Make prediction
        if model:
            prediction = model.predict(processed_data)
            probability = model.predict_proba(processed_data)

            result = {
                'risk_level': prediction[0],
                'engagement_score': probability[0][1] * 100,  # Assuming binary classification
                'confidence': max(probability[0]) * 100
            }

            return jsonify(result)
        else:
            return jsonify({'error': 'Model not loaded'}), 500

    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/simulate', methods=['POST'])
def simulate():
    """Simulate different scenarios"""
    try:
        data = request.get_json()

        if not data:
            return jsonify({'error': 'No data provided'}), 400

        # Get base student data
        student_id = data.get('student_id')
        modifications = data.get('modifications', {})

        # Load student data and apply modifications
        df = pd.read_csv('data/processed_data.csv')
        student_data = df[df['student_id'] == student_id]

        if student_data.empty:
            return jsonify({'error': 'Student not found'}), 404

        # Apply modifications
        for feature, value in modifications.items():
            if feature in student_data.columns:
                student_data[feature] = value

        # Make prediction with modified data
        if model:
            processed_data = preprocess_data(student_data)
            prediction = model.predict(processed_data)
            probability = model.predict_proba(processed_data)

            result = {
                'original_risk': data.get('original_risk', ''),
                'new_risk': prediction[0],
                'new_engagement_score': probability[0][1] * 100,
                'modifications': modifications
            }

            return jsonify(result)

    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/analytics')
def analytics():
    """Get detailed analytics data"""
    try:
        df = pd.read_csv('data/processed_data.csv')

        # Generate analytics data
        analytics_data = {
            'risk_distribution': df['risk_level'].value_counts().to_dict(),
            'department_analysis': df.groupby('department')['risk_level'].value_counts().unstack().fillna(0).to_dict(),
            'attendance_performance_correlation': df[['attendance', 'engagement_score']].corr().to_dict()
        }

        return jsonify(analytics_data)

    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/upload', methods=['POST'])
def upload_file():
    """Upload CSV file for batch predictions"""
    try:
        if 'file' not in request.files:
            return jsonify({'error': 'No file provided'}), 400

        file = request.files['file']
        if file.filename == '':
            return jsonify({'error': 'No file selected'}), 400

        if file and allowed_file(file.filename):
            filename = secure_filename(file.filename)
            filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
            file.save(filepath)

            # Process the uploaded file
            results = process_batch_predictions(filepath)

            return jsonify({
                'message': f'File processed successfully. {len(results)} students analyzed.',
                'results': results
            })
        else:
            return jsonify({'error': 'File type not allowed'}), 400

    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/shap_analysis/<student_id>')
def shap_analysis(student_id):
    """Get SHAP analysis for a specific student"""
    try:
        df = pd.read_csv('data/processed_data.csv')
        student = df[df['student_id'] == student_id]

        if student.empty:
            return jsonify({'error': 'Student not found'}), 404

        # Prepare data for SHAP analysis
        student_data = student[feature_columns]
        student_scaled = scaler.transform(student_data)

        if explainer:
            # Calculate SHAP values
            shap_values = explainer.shap_values(student_scaled)

            # Create visualization
            plt.figure(figsize=(10, 8))
            shap.summary_plot(shap_values, student_data,
                            feature_names=feature_columns, show=False)

            # Save plot to base64
            img_buffer = io.BytesIO()
            plt.savefig(img_buffer, format='png', bbox_inches='tight')
            img_buffer.seek(0)
            img_base64 = base64.b64encode(img_buffer.getvalue()).decode()
            plt.close()

            # Get feature importance for this student
            student_shap = shap_values[0] if len(shap_values.shape) > 2 else shap_values
            feature_importance = list(zip(feature_columns, student_shap))
            feature_importance.sort(key=lambda x: abs(x[1]), reverse=True)

            return jsonify({
                'shap_plot': f'data:image/png;base64,{img_base64}',
                'feature_importance': feature_importance[:10],
                'prediction': model.predict(student_scaled)[0],
                'confidence': max(model.predict_proba(student_scaled)[0]) * 100
            })
        else:
            return jsonify({'error': 'SHAP explainer not available'}), 500

    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/advanced_analytics')
def advanced_analytics():
    """Get advanced analytics with interactive charts"""
    try:
        df = pd.read_csv('data/processed_data.csv')

        # Generate interactive charts using Plotly
        charts = {}

        # 1. Risk distribution over time (if timestamp available)
        if 'timestamp' in df.columns:
            risk_over_time = df.groupby([pd.to_datetime(df['timestamp']).dt.date, 'risk_level']).size().unstack()
            charts['risk_over_time'] = risk_over_time.to_dict()

        # 2. Feature correlation heatmap
        numeric_cols = df.select_dtypes(include=[np.number]).columns
        correlation_matrix = df[numeric_cols].corr()

        # Create heatmap
        fig = go.Figure(data=go.Heatmap(
            z=correlation_matrix.values,
            x=correlation_matrix.columns,
            y=correlation_matrix.columns,
            colorscale='RdBu'
        ))
        charts['correlation_heatmap'] = json.loads(fig.to_json())

        # 3. Department-wise performance
        if 'department' in df.columns:
            dept_performance = df.groupby('department').agg({
                'engagement_score': 'mean',
                'attendance': 'mean',
                'risk_level': lambda x: (x == 'High').mean() * 100
            }).round(2)

            fig = px.bar(dept_performance, y='engagement_score',
                       title='Average Engagement Score by Department')
            charts['department_performance'] = json.loads(fig.to_json())

        # 4. Risk factors analysis
        risk_factors = analyze_risk_factors(df)
        charts['risk_factors'] = risk_factors

        return jsonify(charts)

    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/send_alert', methods=['POST'])
def send_alert():
    """Send email alert for high-risk students"""
    try:
        data = request.get_json()
        student_id = data.get('student_id')
        alert_type = data.get('alert_type', 'high_risk')

        df = pd.read_csv('data/processed_data.csv')
        student = df[df['student_id'] == student_id]

        if student.empty:
            return jsonify({'error': 'Student not found'}), 404

        # Send email alert
        success = send_email_alert(student.iloc[0], alert_type)

        if success:
            return jsonify({'message': 'Alert sent successfully'})
        else:
            return jsonify({'error': 'Failed to send alert'}), 500

    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/model_performance')
def model_performance():
    """Get detailed model performance metrics"""
    try:
        df = pd.read_csv('data/processed_data.csv')

        # Split features and target
        X = df[feature_columns]
        y = df['risk_level']

        # Scale features
        X_scaled = scaler.transform(X)

        # Get predictions
        predictions = model.predict(X_scaled)
        probabilities = model.predict_proba(X_scaled)

        # Calculate metrics
        from sklearn.metrics import classification_report, confusion_matrix

        report = classification_report(y, predictions, output_dict=True)
        conf_matrix = confusion_matrix(y, predictions)

        # Feature importance
        if hasattr(model, 'feature_importances_'):
            feature_imp = list(zip(feature_columns, model.feature_importances_))
            feature_imp.sort(key=lambda x: x[1], reverse=True)
        else:
            feature_imp = []

        return jsonify({
            'classification_report': report,
            'confusion_matrix': conf_matrix.tolist(),
            'feature_importance': feature_imp[:10],
            'model_accuracy': model.score(X_scaled, y)
        })

    except Exception as e:
        return jsonify({'error': str(e)}), 500

def preprocess_data(df):
    """Preprocess input data for prediction"""
    # This function should match the preprocessing done during training
    # For now, return as-is - will be implemented with actual preprocessing logic
    return df

def get_feature_importance(student_data):
    """Calculate feature importance for a student"""
    # This will be implemented with SHAP or model feature importance
    return {}

def allowed_file(filename):
    """Check if file type is allowed"""
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in app.config['ALLOWED_EXTENSIONS']

def process_batch_predictions(filepath):
    """Process batch predictions from uploaded file"""
    try:
        # Read uploaded file
        if filepath.endswith('.csv'):
            df = pd.read_csv(filepath)
        else:
            df = pd.read_excel(filepath)

        # Preprocess data (using global feature_columns)
        processed_data = preprocess_data(df)
        processed_data = processed_data.reindex(columns=feature_columns, fill_value=0)

        # Make predictions
        predictions = model.predict(scaler.transform(processed_data))
        probabilities = model.predict_proba(scaler.transform(processed_data))

        # Format results
        results = []
        for i, (pred, prob) in enumerate(zip(predictions, probabilities)):
            results.append({
                'student_id': df.iloc[i].get('student_id', f'STUD_{i+1}'),
                'name': df.iloc[i].get('name', f'Student {i+1}'),
                'risk_level': pred,
                'engagement_score': max(prob) * 100,
                'confidence': max(prob) * 100
            })

        return results

    except Exception as e:
        raise Exception(f"Batch processing failed: {str(e)}")

def analyze_risk_factors(df):
    """Analyze key risk factors across the dataset"""
    risk_factors = {}

    # High-risk students analysis
    high_risk = df[df['risk_level'] == 'High']

    # Average metrics by risk level
    risk_analysis = df.groupby('risk_level').agg({
        'attendance': 'mean',
        'engagement_score': 'mean',
        'academic_performance': 'mean'
    }).round(2)

    risk_factors['metrics_by_risk'] = risk_analysis.to_dict()

    # Top risk indicators
    numeric_cols = df.select_dtypes(include=[np.number]).columns
    risk_correlations = {}

    for col in numeric_cols:
        if col != 'engagement_score':
            correlation = df['engagement_score'].corr(df[col])
            risk_correlations[col] = abs(correlation)

    # Sort by correlation strength
    top_factors = sorted(risk_correlations.items(), key=lambda x: x[1], reverse=True)[:10]
    risk_factors['top_correlations'] = top_factors

    return risk_factors

def send_email_alert(student_data, alert_type):
    """Send email alert for student"""
    try:
        msg = MIMEMultipart()
        msg['From'] = EMAIL_CONFIG['sender_email']
        msg['To'] = student_data.get('email', 'admin@university.edu')  # Update with actual email
        msg['Subject'] = f"Student Alert: {alert_type.title()} Risk Detected"

        # Email body
        body = f"""
        Student Engagement Alert

        Student: {student_data.get('name', 'N/A')}
        Student ID: {student_data.get('student_id', 'N/A')}
        Risk Level: {student_data.get('risk_level', 'N/A')}
        Engagement Score: {student_data.get('engagement_score', 'N/A')}%

        Recommended Actions:
        1. Schedule counseling session
        2. Monitor attendance closely
        3. Provide academic support
        4. Check for external factors

        Generated by: Student Engagement Prediction System
        """

        msg.attach(MIMEText(body, 'plain'))

        # Send email
        server = smtplib.SMTP(EMAIL_CONFIG['smtp_server'], EMAIL_CONFIG['smtp_port'])
        server.starttls()
        server.login(EMAIL_CONFIG['sender_email'], EMAIL_CONFIG['sender_password'])
        text = msg.as_string()
        server.sendmail(EMAIL_CONFIG['sender_email'], msg['To'], text)
        server.quit()

        return True

    except Exception as e:
        print(f"Email sending failed: {e}")
        return False

def load_model():
    """Load the trained model and create SHAP explainer"""
    global model, feature_columns, scaler, explainer

    try:
        model = joblib.load('models/student_engagement_model.pkl')
        feature_columns = joblib.load('models/feature_columns.pkl')
        scaler = joblib.load('models/scaler.pkl')

        # Try to load SHAP explainer if available
        try:
            explainer = joblib.load('models/shap_explainer.pkl')
            print("✅ SHAP explainer loaded successfully")
        except:
            # Create new SHAP explainer if not saved
            sample_data = pd.read_csv('data/processed_data.csv')
            sample_X = sample_data[feature_columns]
            sample_X_scaled = scaler.transform(sample_X)
            explainer = shap.TreeExplainer(model)
            print("✅ New SHAP explainer created")

    except Exception as e:
        print(f"⚠️  Warning: Could not load model: {e}")

if __name__ == '__main__':
    # Create necessary directories
    os.makedirs('models', exist_ok=True)
    os.makedirs('data', exist_ok=True)
    os.makedirs('templates', exist_ok=True)
    os.makedirs('static', exist_ok=True)
    os.makedirs('static/charts', exist_ok=True)
    os.makedirs('uploads', exist_ok=True)

    # Load model if available
    load_model()

    # Run the app
    print("🚀 Starting Student Engagement Prediction API...")
    print("📊 Dashboard: http://localhost:5000")
    print("📤 Upload: http://localhost:5000/upload")
    print("📈 Analytics: http://localhost:5000/analytics")
    print("🔬 SHAP Analysis: http://localhost:5000/api/shap_analysis/<student_id>")
    print("📧 Email Alerts: http://localhost:5000/api/send_alert")
    print("🎯 Model Performance: http://localhost:5000/api/model_performance")
    app.run(debug=True, host='0.0.0.0', port=5000)
