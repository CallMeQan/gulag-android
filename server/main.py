import threading
import asyncio
from api_server import run_flask
from iot_server import start_ws_servers

if __name__ == "__main__":
    api_server = threading.Thread(target=run_flask, daemon=True)
    api_server.start()

    asyncio.run(start_ws_servers())
