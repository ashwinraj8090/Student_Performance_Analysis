import pandas as pd
import numpy as np
import joblib
import os
import matplotlib.pyplot as plt
import seaborn as sns
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, classification_report, confusion_matrix

# Load dataset
dataset_path = "training_dataset.json"
if not os.path.exists(dataset_path):
    raise FileNotFoundError(f"Dataset {dataset_path} not found.")

df = pd.read_json(dataset_path)  # Corrected JSON reading
print("Dataset successfully loaded.")
print(df.head())

# Preprocess the data
df.dropna(inplace=True)  

# Convert grades into numerical labels
grade_mapping = {'A': 4, 'B': 3, 'C': 2, 'D': 1, 'F': 0}
df['grade'] = df['grade'].map(grade_mapping)

# Define features (X) and target (y)
X = df[['internal_score', 'study_hours', 'assignments_completed', 'attendance']]
y = df['grade']

# Split into training (80%) and testing (20%) sets
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Train the model
model = RandomForestClassifier(n_estimators=100, random_state=42)
model.fit(X_train, y_train)

# Save the trained model
model_filename = "student_grade_model.pkl"
joblib.dump(model, model_filename)
print(f"Model saved as {model_filename}")

# Make predictions on the test set
y_pred = model.predict(X_test)

# Evaluate the model
accuracy = accuracy_score(y_test, y_pred)
print(f"Accuracy: {accuracy * 100:.2f}%")
print("Classification Report:")
print(classification_report(y_test, y_pred))

# Display confusion matrix
conf_matrix = confusion_matrix(y_test, y_pred)
sns.heatmap(conf_matrix, annot=True, fmt="d", cmap="Blues", 
            xticklabels=grade_mapping.keys(), yticklabels=grade_mapping.keys())
plt.xlabel("Predicted")
plt.ylabel("Actual")
plt.title("Confusion Matrix")
plt.show()