use std::collections::HashMap;
use std::time::Instant;
use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize, Debug)]
pub struct ApiRequest {
    method: String,
    url: String,
    headers: HashMap<String, String>,
    body: Option<String>,
}

#[derive(Serialize, Deserialize, Debug)]
pub struct ApiResponse {
    status: u16,
    time_ms: u64,
    headers: HashMap<String, String>,
    body: String,
    size_bytes: usize,
}

#[tauri::command]
async fn execute_request(request: ApiRequest) -> Result<ApiResponse, String> {
    let client = reqwest::Client::new();
    
    let method = match request.method.to_uppercase().as_str() {
        "GET" => reqwest::Method::GET,
        "POST" => reqwest::Method::POST,
        "PUT" => reqwest::Method::PUT,
        "DELETE" => reqwest::Method::DELETE,
        "PATCH" => reqwest::Method::PATCH,
        _ => return Err(format!("Unsupported method: {}", request.method)),
    };

    let mut req_builder = client.request(method, &request.url);

    for (key, value) in request.headers {
        req_builder = req_builder.header(key, value);
    }

    if let Some(body) = request.body {
        req_builder = req_builder.body(body);
    }

    let start_time = Instant::now();
    
    let response = req_builder.send().await.map_err(|e| e.to_string())?;
    
    let duration = start_time.elapsed();
    let status = response.status().as_u16();
    
    let headers: HashMap<String, String> = response.headers()
        .iter()
        .map(|(k, v)| (k.to_string(), v.to_str().unwrap_or("").to_string()))
        .collect();

    let body_text = response.text().await.map_err(|e| e.to_string())?;
    let size_bytes = body_text.len();

    Ok(ApiResponse {
        status,
        time_ms: duration.as_millis() as u64,
        headers,
        body: body_text,
        size_bytes,
    })
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![execute_request])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}