from flask import Flask, request, jsonify
import pickle
import pandas as pd
import logging
from flask_cors import CORS
import os

# Initialize Flask app
app = Flask(__name__)
CORS(app)  # Enable CORS for all domains, restrict if needed

# Set up logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

# Load the trained model pipeline
MODEL_PATH = "inventory_model_with_type.pkl"
model = None

if os.path.exists(MODEL_PATH):
    try:
        with open(MODEL_PATH, "rb") as f:
            model = pickle.load(f)
        logging.info("✅ Model loaded successfully.")
    except Exception as e:
        logging.error(f"❌ Failed to load model: {e}")
        raise e
else:
    logging.error(f"❌ Model file not found at path: {MODEL_PATH}")

@app.route("/", methods=["GET"])
def home():
    return jsonify({"message": "Inventory Demand Prediction API is running."}), 200

@app.route("/predict", methods=["POST"])
def predict():
    if model is None:
        return jsonify({"error": "Model not loaded. Please check server logs."}), 500

    try:
        data = request.get_json()

        if not data:
            return jsonify({"error": "No input data provided or invalid JSON format."}), 400

        # Support for both single and batch prediction
        if isinstance(data, dict):
            data = [data]

        required_fields = {"Temperature", "Sales", "Month", "Medicine_Type"}
        inputs = []

        for idx, item in enumerate(data):
            missing_fields = required_fields - item.keys()
            if missing_fields:
                return jsonify({
                    "error": f"Missing fields in input #{idx + 1}. Missing: {list(missing_fields)}"
                }), 400

            try:
                inputs.append({
                    "Temperature": float(item["Temperature"]),
                    "Sales": float(item["Sales"]),
                    "Month": int(item["Month"]),
                    "Medicine_Type": str(item["Medicine_Type"])
                })
            except (ValueError, TypeError) as ve:
                return jsonify({
                    "error": f"Invalid data type in input #{idx + 1}: {ve}"
                }), 400

        input_df = pd.DataFrame(inputs)
        logging.info(f"Received data for prediction: \n{input_df}")

        predictions = model.predict(input_df)
        predictions = [round(pred, 2) for pred in predictions]

        results = [
            {**inp, "Predicted_Demand": pred}
            for inp, pred in zip(inputs, predictions)
        ]

        return jsonify({"predictions": results}), 200

    except Exception as e:
        logging.exception("Prediction failed.")
        return jsonify({"error": f"Internal server error: {str(e)}"}), 500

if __name__ == "__main__":
    app.run(debug=True, host='0.0.0.0', port=5000)  # Flask will run on port 5000
