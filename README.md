📦 CureLink — Medical Inventory Demand Predictor

CureLink helps predict medical inventory demand using temperature, recent sales, month, and medicine type inputs. It combines a Flask API (Python) for ML predictions with a Node.js backend and a clean frontend UI.
🚀 How to Run the Project

Follow these steps to run everything smoothly:
1️⃣ Start the Python Backend (ML Prediction API)
This runs the machine learning model that predicts demand.
# Go to the project folder (if not already there)
cd path/to/your/project

# Start the Flask app
python app.py
Default URL: http://127.0.0.1:5000
Make sure all required Python packages are installed (e.g., Flask, scikit-learn, etc.)
2️⃣ Start the Node.js Server (Optional: If using server.js)
If your project includes a server.js file (e.g., for additional API routing or frontend serving):
# Install dependencies (only once)
npm install

# Start the Node.js server
node server.js
Default URL: Typically http://localhost:3000 or whichever port is defined.
3️⃣ Open the Frontend (Home Page)
Open the index.html or home.html file in your web browser.
If you're serving HTML through server.js, go to:
http://localhost:3000 (or the port from Node.js)
If using local HTML file directly:
Double-click home.html or open it via your browser.
🛠️ Requirements

Python 3.13.2
Flask
scikit-learn
Other ML-related packages
Node.js
A modern browser (Chrome, Firefox, etc.)
