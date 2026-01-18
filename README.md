# EndpointView

A lightweight, high-performance API testing client with a touch of sweetness. Built with Tauri, Rust, and Svelte.

![EndpointView Screenshot](./screenshot.png)

## Features

*   **Request Builder**: Support for GET, POST, PUT, DELETE, PATCH with custom headers, query parameters, and JSON bodies.
*   **Response Viewer**: Beautifully formatted JSON responses, status codes, latency tracking, and response size.
*   **History**: Automatically saves your request history for quick access.
*   **Sweet Sorbet Theme**: A unique, playful aesthetic designed to make API testing a little more delightful.
*   **System-Level Networking**: Powered by Rust's `reqwest` to bypass CORS and ensure maximum performance.

## Build it Yourself

Want to run EndpointView from source? Follow these steps.

### Prerequisites

*   **Rust**: [Install Rust](https://www.rust-lang.org/tools/install)
*   **Bun**: [Install Bun](https://bun.sh/)
*   **C++ Build Tools**: Required for compiling Tauri apps (e.g., Visual Studio Build Tools on Windows).

### Instructions

1.  **Clone the repository**
    ```bash
    git clone https://github.com/Skullmc1/EndpointView.git
    cd EndpointView
    ```

2.  **Install Frontend Dependencies**
    ```bash
    bun install
    ```

3.  **Run in Development Mode**
    This will start the frontend server and launch the Tauri window.
    ```bash
    bun tauri dev
    ```

4.  **Build for Production**
    To create an optimized executable for your operating system.
    ```bash
    bun tauri build
    ```
