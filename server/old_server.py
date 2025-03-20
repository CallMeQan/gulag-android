import asyncio, threading
import json
from flask import Flask, jsonify
import websockets
import datetime

DEBUG = True
DEBUG_DATA = True

HOSTNAME = "0.0.0.0"
PORT_API = 8000
PORT_WS = 8001
STORAGE_LIMIT = 100
MIN_TIMESTAMP_DIFF = 0.38

# ============================

app = Flask(__name__)
storage_lock = threading.Lock()
tmp_storage = []
latest_data_timestamp: None | datetime.datetime = None

async def gps_receiver(websocket):
    global latest_data_timestamp
    async for message in websocket:
        try:
            data = json.loads(message)
            
            if "latitude" not in data or "longitude" not in data or "accuracy" not in data:
                if DEBUG_DATA:
                    print("Received invalid GPS data.")
                continue

            # Thread-safe timestamp check
            curr = datetime.datetime.now()
            with storage_lock:
                # Check if data received too fast
                # 1st check this is not the first data received
                # 2nd diff between current and latest data timestamp is less than 0.8 seconds
                # 3rd check if the current data is the same as the latest data in storage
                # => If all conditions are met, skip adding the data to storage
                if latest_data_timestamp is not None:
                    diff = (curr - latest_data_timestamp).total_seconds()
                    if diff < MIN_TIMESTAMP_DIFF:
                        if data["latitude"] == tmp_storage[-1]["latitude"] and data["longitude"] == tmp_storage[-1]["longitude"]:
                            if DEBUG_DATA:
                                print("Received data too fast. Skip adding to storage.")
                            continue

                # Keep track of the latest data timestamp
                latest_data_timestamp = curr
                data["timestamp"] = latest_data_timestamp.isoformat()
                print(f"Received GPS Data: {data}")

                # Add data to storage (thread-safe)
                if len(tmp_storage) >= STORAGE_LIMIT:
                    tmp_storage.pop(0)
                    if DEBUG_DATA:
                        print("Remove oldest data from storage.")
                tmp_storage.append(data)
                if DEBUG_DATA:
                    print("Data added to storage.")
        except json.JSONDecodeError:
            print("Received invalid JSON data.")
        except Exception as e:
            print(f"An error occurred: {e}")

async def start_ws_servers():
    async with websockets.serve(gps_receiver, HOSTNAME, PORT_WS):
        print(f"GPS Server started at ws://{HOSTNAME}:{PORT_WS}")
        await asyncio.Future()

@app.route("/get", methods=["GET"])
def get_latest_data():
    with storage_lock:
        data_copy = tmp_storage.copy()
        tmp_storage.clear()
    return jsonify(data_copy)

def run_flask():
    global tmp_storage
    app.run(host=HOSTNAME, port=PORT_API, debug=DEBUG, use_reloader=False)

if __name__ == "__main__":
    api_server = threading.Thread(target=run_flask, daemon=True)
    api_server.start()

    asyncio.run(start_ws_servers())
