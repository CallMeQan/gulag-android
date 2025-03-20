import hmac, hashlib
def generate_api_key(secret_key: str) -> str:
    return hmac.new(secret_key.encode(), digestmod=hashlib.sha256).hexdigest()