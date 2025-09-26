from flask import Flask, request, jsonify
import pandas as pd
import joblib  
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  

# Load the trained model
model = joblib.load("student_grade_model.pkl")  

@app.route('/predict', methods=['POST'])
def predict():
    if 'file' not in request.files:
        return jsonify({'error': 'No file uploaded'}), 400

    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No file selected'}), 400

    try:
        # Determine file format and read accordingly
        if file.filename.endswith('.csv'):
            df = pd.read_csv(file)
        elif file.filename.endswith(('.xls', '.xlsx')):
            df = pd.read_excel(file)
        elif file.filename.endswith('.json'):
            df = pd.read_json(file)
        else:
            return jsonify({'error': 'Unsupported file format'}), 400

        # Required columns for prediction
        required_columns = ['student_id', 'subject', 'internal_score', 'study_hours', 'assignments_completed', 'attendance']
        if not all(col in df.columns for col in required_columns):
            return jsonify({'error': 'Missing required columns'}), 400

        # Make predictions
        predictions = model.predict(df[required_columns[2:]])  

        # Mapping numerical predictions to grades
        grade_mapping = {
            4: "A",
            3: "B",
            2: "C",
            1: "D",
            0: "F"
        }

        predicted_grades = [grade_mapping.get(pred, "Unknown") for pred in predictions]

        # Mapping grades to categories
        category_mapping = {
            "A": "Good",
            "B": "Good",
            "C": "Average",
            "D": "At Risk",
            "F": "At Risk"
        }

        predicted_categories = [category_mapping.get(grade, "Unknown") for grade in predicted_grades]

        # Preparing response
        df["Predicted_Grade"] = predicted_grades
        df["Predicted_Category"] = predicted_categories

        response_data = df.to_dict(orient="records")
        return jsonify(response_data)

    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)