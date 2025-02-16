from llama_cpp import Llama

# Load the model (Change path if needed)
llm = Llama(model_path="path")  # Update to your actual path

def get_ai_explanation(url, reason):
    prompt = f"The website {url} is unsafe due to {reason}. Explain why in simple terms."
    response = llm(prompt, max_tokens=100)
    return response["choices"][0]["text"]

# Example Usage
if __name__ == "__main__":
    print(get_ai_explanation("example.com", "It has suspicious login forms"))
