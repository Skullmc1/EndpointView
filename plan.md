# EndpointView Development Plan

## 1. Overview
EndpointView is a lightweight, high-performance API testing client built with Tauri, Rust, and Svelte. It emphasizes a "Sweet Sorbet" kawaii aesthetic while providing robust system-level networking capabilities.

## 2. Technical Architecture
- **Frontend**: Svelte 5 (TypeScript) for UI, utilizing Svelte Stores for state management.
- **Backend**: Rust (Tauri v2) for handling HTTP requests via `reqwest` to bypass CORS and ensure performance.
- **Communication**: Tauri Commands (`invoke`) to pass request data from Frontend to Backend and return responses.
- **Styling**: Tailwind CSS with a custom configuration for the "Sweet Sorbet" palette.

## 3. Implementation Phases

### Phase 3.1: Dependencies & Configuration
**Rust (`src-tauri/Cargo.toml`)**
- Add `reqwest = { version = "0.12", features = ["json", "multipart"] }`
- Ensure `serde` and `serde_json` are present.

**Frontend (`package.json`)**
- Install `tailwindcss`, `postcss`, `autoprefixer`.
- Install `lucide-svelte` for icons.
- Configure `tailwind.config.js` with the specific color palette:
  - Sorbet Dark: `#5d2a42`
  - Sorbet Red: `#fb6376`
  - Sorbet Pink: `#fcb1a6`
  - Sorbet Peach: `#ffdccc`
  - Sorbet Cream: `#fff9ec`
- Configure `@font-face` in `app.css` for `Viafont`, `Urba`, `timeburnerbold`, `timeburnernormal`.

### Phase 3.2: Rust Backend (Core Logic)
**File: `src-tauri/src/lib.rs`**
- **Structs**:
  - `ApiRequest`: `method` (String), `url` (String), `headers` (HashMap), `body` (Option<String>).
  - `ApiResponse`: `status` (u16), `time_ms` (u64), `headers` (HashMap), `body` (String/JSON), `size_bytes` (usize).
- **Command**:
  - `#[tauri::command] async fn execute_request(request: ApiRequest) -> Result<ApiResponse, String>`
- **Logic**:
  - Use `reqwest::Client` (reuse client if possible or create new).
  - Measure execution time using `std::time::Instant`.
  - Handle errors gracefully and map to `Result`.

### Phase 3.3: Frontend State Management
**File: `src/lib/stores.ts`**
- `requestStore`: Stores current method, URL, headers array, query params array, body string.
- `responseStore`: Stores the last received `ApiResponse` or error state.
- `historyStore`: Persists a list of past requests (localStorage synced).
- `themeStore`: (Optional) If we need dynamic theme toggling, though the prompt implies a fixed theme.

### Phase 3.4: UI Components & Layout
**Layout (`src/routes/+layout.svelte`)**
- Initialize global styles (Fonts, Tailwind).
- **Custom Titlebar**:
  - Fixed top bar.
  - Custom window controls (Minimize, Maximize, Close) using Tauri APIs.
  - Drag region.

**Main Page (`src/routes/+page.svelte`)**
- **Sidebar**:
  - List of history items.
  - "Clear History" button.
- **Main Content Area**:
  - **Request Section**:
    - Method Dropdown (GET, POST, etc.).
    - URL Input (with validation visual cues).
    - Send Button.
    - Tabs: Headers, Params, Body.
  - **Response Section**:
    - Status Badge (Green 2xx, Red 4xx/5xx).
    - Latency (ms).
    - Body View (Syntax highlighted JSON if applicable, or raw text).

### Phase 3.5: Styling & Theming ("Sweet Sorbet")
- **Global CSS**: Remove scrollbars (`::-webkit-scrollbar { display: none; }`).
- **Backgrounds**: Soft gradients or flat colors from the palette (`Sorbet Cream` bg).
- **Accents**: `Sorbet Red` for primary actions (Send button).
- **Decorations**:
  - CSS-based cherry blossom petals or SVG imports.
  - Rounded corners (`rounded-xl` or higher).
  - Soft shadows.

## 4. File Structure (Proposed Additions)
```
src/
├── lib/
│   ├── components/
│   │   ├── TitleBar.svelte
│   │   ├── Sidebar.svelte
│   │   ├── RequestBuilder.svelte
│   │   ├── ResponseViewer.svelte
│   │   └── ui/ (atoms like Button, Input)
│   ├── stores.ts
│   └── utils.ts
└── routes/
    └── +layout.svelte (Global layout + Titlebar)
```

## 5. Verification Plan
- **Backend Test**: Write a Rust unit test for `execute_request` (mocking the network or using a public echo API).
- **Frontend Test**: Manual verification of UI responsiveness and specific styling rules.
- **E2E**: Launch app, hit `https://jsonplaceholder.typicode.com/todos/1`, verify JSON response and status 200.
