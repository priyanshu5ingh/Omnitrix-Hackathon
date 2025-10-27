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

        print("📈 Missing values:", df.isnull().sum()[df.isnull().sum() > 0])

        print("🎯 Identifying target variable..." )       # Look for potential target variables
        potential_targets = []
        for col in df.columns:
            if any(word in col.lower() for word in
                   ['engage', 'drop', 'risk', 'performance', 'gpa', 'grade', 'status', 'complete', 'disengage', 'dropout', 'fail']):
                potential_targets.append(col)

        # Check for dropout column specifically (common in student datasets)
        if 'dropout' in df.columns:
            self.target_column = 'dropout'
        elif potential_targets:
            print(f"Potential target variables: {potential_targets}")
            # Assume first match is target (can be modified)
            self.target_column = potential_targets[0]
        else:
            print("No obvious target variable found. Available columns:", list(df.columns))
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

        # Create risk levels from target variable
        print(f"🎯 Target variable: {self.target_column}")
        print(f"   Target unique values: {df[self.target_column].nunique()}")
        print(f"   Target value counts: {df[self.target_column].value_counts().to_dict()}")

        # Check if target is already categorical
        if df[self.target_column].dtype in ['int64', 'float64'] and df[self.target_column].nunique() <= 10:
            # Convert numerical target to categorical risk levels for display
            if df[self.target_column].nunique() == 2:
                # Binary classification - create string labels for display but keep numerical for training
                df['risk_level'] = df[self.target_column].map({0: 'Low', 1: 'High'})
                print("   Binary classification detected - using as dropout risk")
            else:
                # Multi-class numerical - use qcut for balanced classes
                try:
                    df['risk_level'] = pd.qcut(df[self.target_column], q=min(3, df[self.target_column].nunique()),
                                              labels=['Low', 'Medium', 'High'][:min(3, df[self.target_column].nunique())],
                                              duplicates='drop')
                    print(f"   Converted to {df['risk_level'].nunique()} risk levels using quantiles")
                except ValueError as e:
                    print(f"   Warning: qcut failed ({e}), using direct mapping")
                    df['risk_level'] = df[self.target_column].astype(str)
        else:
            # Target is already categorical
            df['risk_level'] = df[self.target_column]
            print(f"   Using categorical target directly ({df['risk_level'].nunique()} classes)")

        # For training, we need numerical labels, so encode the risk_level
        self.label_encoders['risk_level'] = LabelEncoder()
        df['risk_level_encoded'] = self.label_encoders['risk_level'].fit_transform(df['risk_level'])

        # Store engagement score for reference (if target is numerical)
        if df[self.target_column].dtype in ['int64', 'float64']:
            df['engagement_score'] = df[self.target_column]
        else:
            # For categorical targets, create a numerical engagement score
            df['engagement_score'] = df['risk_level'].map({'Low': 85, 'Medium': 65, 'High': 35}).fillna(50)

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

        # Study behavior features
        study_cols = [col for col in numerical_cols if any(word in col.lower()
                     for word in ['study', 'hour', 'time'])]
        if study_cols:
            df['study_intensity'] = df[study_cols[0]]

        # Assignment/project features
        assignment_cols = [col for col in numerical_cols if any(word in col.lower()
                          for word in ['assignment', 'project', 'submit'])]
        if assignment_cols:
            df['assignment_completion'] = df[assignment_cols[0]]

        # Activity features
        activity_cols = [col for col in numerical_cols if 'activit' in col.lower()]
        if activity_cols:
            df['activity_participation'] = df[activity_cols[0]]

        # Create interaction features
        if 'attendance_rate' in df.columns and 'academic_performance' in df.columns:
            df['attendance_performance_interaction'] = df['attendance_rate'] * df['academic_performance']

        if 'study_intensity' in df.columns and 'assignment_completion' in df.columns:
            df['study_assignment_interaction'] = df['study_intensity'] * df['assignment_completion']

        # Risk indicators
        if 'past_failures' in df.columns:
            df['failure_risk'] = df['past_failures'] > 0

        return df

    def train_model(self, df, model_type='xgboost'):
        """Train the machine learning model"""
        print(f"🤖 Training {model_type} model...")

        # Prepare features and target
        feature_cols = [col for col in df.columns if col not in
                       ['risk_level', 'risk_level_encoded', self.target_column, 'engagement_score', 'student_id', 'name']]

        # Remove columns with low variance
        feature_cols = [col for col in feature_cols if df[col].std() > 0.01]

        self.feature_columns = feature_cols
        X = df[feature_cols]
        y = df['risk_level_encoded']  # Use encoded numerical labels for training

        print(f"🎯 Using {len(feature_cols)} features for training")
        print(f"📊 Target distribution: {df['risk_level'].value_counts().to_dict()}")

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
            # Calculate class weights for imbalanced data
            class_counts = y_train.value_counts()
            total_samples = len(y_train)
            class_weights = total_samples / (len(class_counts) * class_counts)

            self.model = xgb.XGBClassifier(
                n_estimators=100,
                max_depth=6,
                learning_rate=0.1,
                random_state=42,
                eval_metric='logloss',
                scale_pos_weight=class_weights[1] / class_weights[0]  # Weight for positive class
            )
        elif model_type.lower() == 'randomforest':
            # Calculate class weights for Random Forest
            class_counts = y_train.value_counts()
            total_samples = len(y_train)
            class_weights = total_samples / (len(class_counts) * class_counts)

            self.model = RandomForestClassifier(
                n_estimators=100,
                max_depth=10,
                random_state=42,
                class_weight='balanced'
            )
        else:
            self.model = RandomForestClassifier(n_estimators=100, random_state=42)

        # Fit model
        self.model.fit(X_train_scaled, y_train)

        # Evaluate model
        train_score = self.model.score(X_train_scaled, y_train)
        test_score = self.model.score(X_test_scaled, y_test)

        print(f"📊 Training accuracy: {train_score:.3f}")
        print(f"📊 Test accuracy: {test_score:.3f}")
        # Cross-validation
        cv_scores = cross_val_score(self.model, X_train_scaled, y_train, cv=5)
        print(f"🔍 Cross-validation scores: {cv_scores.mean():.3f} (+/- {cv_scores.std() * 2:.3f})")

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

            # Ensure data is in the right format for SHAP
            X_train_sample = X_train[:1000]  # Use smaller sample for SHAP

            # Calculate SHAP values for training data
            shap_values = self.explainer.shap_values(X_train_sample)

            # Create SHAP summary plot
            plt.figure(figsize=(12, 8))
            shap.summary_plot(shap_values, X_train_sample,
                            feature_names=feature_names, show=False)
            plt.savefig('shap_summary.png', dpi=300, bbox_inches='tight')
            plt.close()

            # Create SHAP waterfall plot for a sample prediction
            sample_idx = 0
            plt.figure(figsize=(10, 6))
            if isinstance(shap_values, list) and len(shap_values) > 1:
                # Multi-class case
                shap.plots.waterfall(self.explainer.expected_value[1], shap_values[1][sample_idx],
                                   X_train_sample[sample_idx], feature_names=feature_names, show=False)
            else:
                # Binary case
                shap.plots.waterfall(self.explainer.expected_value, shap_values[sample_idx],
                                   X_train_sample[sample_idx], feature_names=feature_names, show=False)
            plt.savefig('shap_waterfall.png', dpi=300, bbox_inches='tight')
            plt.close()

            print("✅ SHAP analysis completed and saved")

        except Exception as e:
            print(f"⚠️  SHAP analysis failed: {e}")
            print("   Continuing without SHAP analysis...")
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
