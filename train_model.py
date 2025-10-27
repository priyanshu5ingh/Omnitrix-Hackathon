import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split, cross_val_score
from sklearn.preprocessing import StandardScaler, LabelEncoder
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import classification_report, confusion_matrix, roc_auc_score
from sklearn.feature_selection import SelectFromModel
import xgboost as xgb
import joblib
import os
from datetime import datetime
import warnings
import shap
import matplotlib.pyplot as plt
import seaborn as sns
warnings.filterwarnings('ignore')

class StudentEngagementPredictor:
    def __init__(self, data_path='Dataset.xlsx'):
        self.data_path = data_path
        self.model = None
        self.scaler = None
        self.feature_columns = None
        self.label_encoders = {}
        self.target_column = None
        self.explainer = None
        self.training_history = {}

    def load_and_analyze_data(self):
        """Load and perform initial analysis of the dataset"""
        print("🔍 Loading dataset...")
        df = pd.read_excel(self.data_path)

        print(f"📊 Dataset shape: {df.shape}")
        print("\n📋 Column information:")
        for col in df.columns:
            print(f"  • {col}: {df[col].dtype}")
            if df[col].dtype == 'object':
                print(f"    - Unique values: {df[col].nunique()}")

        print("
📈 Missing values:"        print(df.isnull().sum()[df.isnull().sum() > 0])

        print("
🎯 Identifying target variable..."        # Look for potential target variables
        potential_targets = []
        for col in df.columns:
            if any(word in col.lower() for word in
                   ['engage', 'drop', 'risk', 'performance', 'gpa', 'grade', 'status', 'complete', 'disengage']):
                potential_targets.append(col)

        if potential_targets:
            print(f"Potential target variables: {potential_targets}")
            # Assume first match is target (can be modified)
            self.target_column = potential_targets[0]
        else:
            print("No obvious target variable found. Please specify manually.")
            return None

        return df

    def preprocess_data(self, df):
        """Clean and preprocess the data"""
        print("🧹 Preprocessing data...")

        # Handle missing values
        for col in df.columns:
            if df[col].isnull().sum() > 0:
                if df[col].dtype in ['int64', 'float64']:
                    # Fill numerical with median
                    df[col].fillna(df[col].median(), inplace=True)
                else:
                    # Fill categorical with mode
                    df[col].fillna(df[col].mode()[0], inplace=True)

        # Encode categorical variables
        categorical_cols = df.select_dtypes(include=['object']).columns.tolist()

        # Remove target if it's categorical
        if self.target_column in categorical_cols:
            categorical_cols.remove(self.target_column)

        for col in categorical_cols:
            if col not in self.label_encoders:
                self.label_encoders[col] = LabelEncoder()
            df[col] = self.label_encoders[col].fit_transform(df[col].astype(str))

        # Create risk levels from engagement scores if needed
        if 'engagement' in self.target_column.lower() or 'score' in self.target_column.lower():
            # Convert numerical target to categorical risk levels
            df['risk_level'] = pd.qcut(df[self.target_column], q=3,
                                      labels=['Low', 'Medium', 'High'])
            df['engagement_score'] = df[self.target_column]
        else:
            df['risk_level'] = df[self.target_column]

        # Feature engineering
        df = self.create_features(df)

        return df

    def create_features(self, df):
        """Create additional features for better prediction"""
        print("🔧 Creating features...")

        # Performance indicators
        numerical_cols = df.select_dtypes(include=[np.number]).columns.tolist()

        # Attendance-related features
        attendance_cols = [col for col in numerical_cols if 'attend' in col.lower()]
        if attendance_cols:
            df['attendance_rate'] = df[attendance_cols[0]]

        # Academic performance features
        grade_cols = [col for col in numerical_cols if any(word in col.lower()
                     for word in ['gpa', 'grade', 'mark', 'score', 'cgpa'])]
        if grade_cols:
            df['academic_performance'] = df[grade_cols[0]]

        # Create interaction features
        if 'attendance_rate' in df.columns and 'academic_performance' in df.columns:
            df['attendance_performance_interaction'] = df['attendance_rate'] * df['academic_performance']

        # Socio-economic indicators (if available)
        socio_cols = [col for col in df.columns if any(word in col.lower()
                     for word in ['income', 'economic', 'financial', 'family', 'background'])]
        if socio_cols:
            df['socio_economic_score'] = df[socio_cols].mean(axis=1)

        return df

    def train_model(self, df, model_type='xgboost'):
        """Train the machine learning model"""
        print(f"🤖 Training {model_type} model...")

        # Prepare features and target
        feature_cols = [col for col in df.columns if col not in
                       ['risk_level', self.target_column, 'engagement_score', 'student_id', 'name']]

        # Remove columns with low variance
        feature_cols = [col for col in feature_cols if df[col].std() > 0.01]

        self.feature_columns = feature_cols
        X = df[feature_cols]
        y = df['risk_level']

        # Split data
        X_train, X_test, y_train, y_test = train_test_split(
            X, y, test_size=0.2, random_state=42, stratify=y
        )

        # Scale features
        self.scaler = StandardScaler()
        X_train_scaled = self.scaler.fit_transform(X_train)
        X_test_scaled = self.scaler.transform(X_test)

        # Train model
        if model_type.lower() == 'xgboost':
            self.model = xgb.XGBClassifier(
                n_estimators=100,
                max_depth=6,
                learning_rate=0.1,
                random_state=42,
                eval_metric='mlogloss'
            )
        elif model_type.lower() == 'randomforest':
            self.model = RandomForestClassifier(
                n_estimators=100,
                max_depth=10,
                random_state=42
            )
        else:
            self.model = RandomForestClassifier(n_estimators=100, random_state=42)

        # Fit model
        self.model.fit(X_train_scaled, y_train)

        # Evaluate model
        train_score = self.model.score(X_train_scaled, y_train)
        test_score = self.model.score(X_test_scaled, y_test)

        print(f"📊 Training accuracy: {train_score:.3f}")
".3f"test_score:.3f"
        # Cross-validation
        cv_scores = cross_val_score(self.model, X_train_scaled, y_train, cv=5)
        print(f"🔍 Cross-validation scores: {cv_scores.mean():.3f} (+/- {cv_scores.std() * 2:".3f"")

        # Feature importance
        self.plot_feature_importance()

        # Create SHAP explainer
        self.create_shap_explainer(X_train_scaled, feature_cols)

        # Save processed data
        df.to_csv('data/processed_data.csv', index=False)

        return X_test_scaled, y_test, feature_cols

    def create_shap_explainer(self, X_train, feature_names):
        """Create SHAP explainer for model interpretability"""
        print("🔬 Creating SHAP explainer...")

        try:
            # Create SHAP explainer
            self.explainer = shap.TreeExplainer(self.model)

            # Calculate SHAP values for training data
            shap_values = self.explainer.shap_values(X_train)

            # Create SHAP summary plot
            plt.figure(figsize=(12, 8))
            shap.summary_plot(shap_values, X_train,
                            feature_names=feature_names, show=False)
            plt.savefig('shap_summary.png', dpi=300, bbox_inches='tight')
            plt.close()

            # Create SHAP waterfall plot for a sample prediction
            sample_idx = 0
            plt.figure(figsize=(10, 6))
            shap.plots.waterfall(self.explainer.expected_value, shap_values[sample_idx],
                               X_train[sample_idx], feature_names=feature_names, show=False)
            plt.savefig('shap_waterfall.png', dpi=300, bbox_inches='tight')
            plt.close()

            print("✅ SHAP analysis completed and saved")

        except Exception as e:
            print(f"⚠️  SHAP analysis failed: {e}")
            self.explainer = None

    def plot_feature_importance(self):
        """Plot and save feature importance"""
        if not self.model or not self.feature_columns:
            return

        try:
            import matplotlib.pyplot as plt
            import seaborn as sns

            # Get feature importance
            if hasattr(self.model, 'feature_importances_'):
                importance = self.model.feature_importances_
            else:
                return

            # Create DataFrame for plotting
            feature_imp = pd.DataFrame({
                'feature': self.feature_columns,
                'importance': importance
            }).sort_values('importance', ascending=False)

            # Plot
            plt.figure(figsize=(10, 8))
            sns.barplot(x='importance', y='feature', data=feature_imp.head(15))
            plt.title('Top 15 Feature Importance')
            plt.tight_layout()
            plt.savefig('feature_importance.png', dpi=300, bbox_inches='tight')
            plt.close()

            print("📈 Feature importance plot saved as 'feature_importance.png'")

        except ImportError:
            print("⚠️  Matplotlib/seaborn not available for plotting")

    def save_model(self):
        """Save the trained model and preprocessing objects"""
        print("💾 Saving model...")

        os.makedirs('models', exist_ok=True)
        os.makedirs('data', exist_ok=True)

        # Save model and components
        joblib.dump(self.model, 'models/student_engagement_model.pkl')
        joblib.dump(self.scaler, 'models/scaler.pkl')
        joblib.dump(self.feature_columns, 'models/feature_columns.pkl')
        joblib.dump(self.label_encoders, 'models/label_encoders.pkl')

        # Save SHAP explainer if available
        if self.explainer:
            joblib.dump(self.explainer, 'models/shap_explainer.pkl')
            print("✅ SHAP explainer saved")

        # Save training history
        self.training_history['timestamp'] = datetime.now()
        self.training_history['model_type'] = type(self.model).__name__
        self.training_history['feature_count'] = len(self.feature_columns)
        self.training_history['training_samples'] = len(pd.read_csv('data/processed_data.csv'))

        joblib.dump(self.training_history, 'models/training_history.pkl')

        print("✅ Model saved successfully!")

    def predict(self, new_data):
        """Make predictions on new data"""
        if not self.model:
            raise ValueError("Model not trained yet!")

        # Preprocess new data
        processed_data = self.preprocess_data(new_data.copy())

        # Select only trained features
        processed_data = processed_data[self.feature_columns]

        # Scale data
        processed_data_scaled = self.scaler.transform(processed_data)

        # Make predictions
        predictions = self.model.predict(processed_data_scaled)
        probabilities = self.model.predict_proba(processed_data_scaled)

        return predictions, probabilities

    def get_shap_analysis(self, data):
        """Get SHAP analysis for given data"""
        if not self.explainer:
            raise ValueError("SHAP explainer not available!")

        # Preprocess and scale data
        processed_data = self.preprocess_data(data)
        processed_data = processed_data[self.feature_columns]
        scaled_data = self.scaler.transform(processed_data)

        # Calculate SHAP values
        shap_values = self.explainer.shap_values(scaled_data)

        return shap_values, processed_data

def main():
    """Main training pipeline"""
    print("🎓 Student Engagement Prediction System")
    print("=" * 50)

    # Initialize predictor
    predictor = StudentEngagementPredictor()

    # Load and analyze data
    df = predictor.load_and_analyze_data()
    if df is None:
        print("❌ Could not proceed without valid dataset")
        return

    # Preprocess data
    processed_df = predictor.preprocess_data(df)

    # Train model
    X_test, y_test, feature_cols = predictor.train_model(processed_df)

    # Evaluate on test set
    print("\n📊 Detailed Evaluation:")
    y_pred = predictor.model.predict(predictor.scaler.transform(X_test))

    print("\nConfusion Matrix:")
    print(confusion_matrix(y_test, y_pred))

    print("\nClassification Report:")
    print(classification_report(y_test, y_pred))

    # Save model
    predictor.save_model()

    print("\n🎉 Training complete!")
    print("🚀 Ready to launch the dashboard with: python app.py")

if __name__ == "__main__":
    main()
