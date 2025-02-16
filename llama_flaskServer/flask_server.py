from flask import Flask, request, jsonify
from llama_cpp import Llama
from flask_cors import CORS



# Load the model
llm = Llama(model_path="path")

app = Flask(__name__)
CORS(app)  # This allows all domains by default. You can restrict it as needed.

@app.route("/explanation", methods=["POST"])
def explain():
    try:
        print("Request received!")  # Add this line for logging
        data = request.json
        print("Received data:", data)  # Log the received data
        url = data.get("url", "unknown website")
        reason = data.get("reason", "no reason provided")
        prompt = f"The website {url} is unsafe due to {reason}. Explain why in simple terms."
        
        response = llm(prompt, max_tokens=100)
        return jsonify({"explanation": response["choices"][0]["text"]})
    except Exception as e:
        print(f"Error: {e}")
        return jsonify({'error': 'An error occurred while processing the request'}), 500
if __name__ == "__main__":
    app.run(port=5001, debug=True)
