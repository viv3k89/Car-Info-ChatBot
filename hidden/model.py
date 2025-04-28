import pandas as pd

# Load the dataset
data = pd.read_csv(r"D:\Users\suraj\Downloads\final.csv")

# Check for unique values in Safety Ratings
print(data['Safety Ratings'].unique())

# Map safety ratings to numeric values
safety_rating_mapping = {
    '5 stars': 5,
    '4 stars': 4,
    '3 stars': 3,
    '2 stars': 2,
    '1 star': 1
}
data['Safety Ratings'] = data['Safety Ratings'].map(safety_rating_mapping)
print(data.columns)
# Check for any NaN values after mapping
print(data['Safety Ratings'].isnull().sum())

# Drop rows with NaN values if any exist 
data.dropna(inplace=True)

# Convert other necessary columns to numeric# Remove spaces and convert price 
data['price '] = pd.to_numeric(data['price '], errors='coerce')
data['Horsepower'] = data['Horsepower'].astype(float)
data['Torque'] = data['Torque'].astype(float)
data['Fuel Economy'] = data['Fuel Economy'].astype(float)


# One-hot encoding for categorical features
data = pd.get_dummies(data, columns=['Engine Type', 'Body Style', 'Transmission', 'Drivetrain', 'Make'], drop_first=True)

# Define features and target variable
X = data.drop(columns=['Model'])
y = data['Model']

from sklearn.model_selection import train_test_split

# Split the data into training and testing sets
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import classification_report

# Initialize and train the model
model = RandomForestClassifier(n_estimators=100, random_state=42)
model.fit(X_train, y_train)

# Make predictions
y_pred = model.predict(X_test)

# Evaluate the model
print(y_pred)
print(X_test.columns)

