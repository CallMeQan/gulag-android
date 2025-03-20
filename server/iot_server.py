import asyncio
import json
import datetime
import websockets
from tmp_storange import storage_lock, tmp_storage
from settings import DEBUG_DATA, HOSTNAME, PORT_WS, STORAGE_LIMIT, MIN_TIMESTAMP_DIFF

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

            curr = datetime.datetime.now()
            with storage_lock:
                if latest_data_timestamp is not None:
                    diff = (curr - latest_data_timestamp).total_seconds()
                    if diff < MIN_TIMESTAMP_DIFF:
                        if data["latitude"] == tmp_storage[-1]["latitude"] and data["longitude"] == tmp_storage[-1]["longitude"]:
                            if DEBUG_DATA:
                                print("Received data too fast. Skip adding to storage.")
                            continue

                latest_data_timestamp = curr
                data["timestamp"] = latest_data_timestamp.isoformat()
                print(f"Received GPS Data: {data}")

                if len(tmp_storage) >= STORAGE_LIMIT:
                    tmp_storage.pop(0)
                    if DEBUG_DATA:
                        print("Removed oldest data from storage.")
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
