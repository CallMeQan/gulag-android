# Gulag Runner Mobile Application

Made in Tauri, React and Vite

## Architecture

### Mobile Development

-   Tauri & Rust as **backend**
-   React & Typescript as **frontend**

### IoT Server (Python)

-   Websocket as **ws server** to receive data from Mobile
-   Flask as **api server** which has route `"/get"` to get data as json

## Recommended IDE Setup

-   [VS Code](https://code.visualstudio.com/) + [Tauri](https://marketplace.visualstudio.com/items?itemName=tauri-apps.tauri-vscode) + [rust-analyzer](https://marketplace.visualstudio.com/items?itemName=rust-lang.rust-analyzer)

## [Run server in Linux](./server/README.md)
