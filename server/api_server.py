from flask import Flask, json, jsonify, request
from .lib.hmac_sha256 import generate_api_key
from settings import DEBUG, HOSTNAME, PORT_API
from tmp_storange import storage_lock, tmp_storage

# API_KEYS_FILE = "api_keys.json"

# def save_api_key(key: str) -> bool:
#     try:
#         with open(API_KEYS_FILE, "r") as f:
#             api_keys = json.load(f)
#     except (FileNotFoundError):
#         api_keys = {}
#     except Exception:
#         return False
#     api_keys[key] = ["read", "write"]
    
#     with open(API_KEYS_FILE, "w") as f:
#         json.dump(api_keys, f, indent=4)
#     return True


# def compare_api_key(key: str) -> bool:
#     try:
#         with open(API_KEYS_FILE, "r") as f:
#             api_keys = json.load(f)
#     except (FileNotFoundError):
#         return False
#     except Exception as e:
#         return False
#     return key in api_keys

app = Flask(__name__)

@app.route("/get", methods=["GET"])
def get_latest_data():
    with storage_lock:
        data_copy = tmp_storage.copy()
        tmp_storage.clear()
    return jsonify(data_copy)

@app.route("/new_key", methods=["POST"])
def new_secret_key():
    if not request.args.get("secret_key"):
        return jsonify({"error": "No secret key provided."}), 400
    
    new_api_key = generate_api_key(request.args.get("secret_key"))
    # if not save_api_key(new_api_key):
    #     return jsonify({"error": "Failed to save new key."}), 500
    return jsonify({"key": new_api_key}), 200

def run_flask():
    app.run(host=HOSTNAME, port=PORT_API, debug=DEBUG, use_reloader=False)
