# Performance Analysis Report - 2025-12-03

## Executive Summary
The application currently handles data loading in a way that will not scale. Both the backend API and the frontend client load *all* artifact data at once. This "load all" strategy will cause significant performance degradation as the number of artifacts grows.

## Findings

### 1. O(N) File I/O on API Requests (High)
*   **Location:** `web_app/server/api.js` (`GET /api/artifacts`)
*   **Issue:** Every request to `/api/artifacts` triggers `readdir` on the artifacts and published directories, followed by `readFile` for *every* JSON and Markdown file found.
*   **Impact:** Response time will increase linearly (or worse) with the number of files. With 100+ artifacts, the API will become noticeably slow.
*   **Recommendation:**
    *   Implement pagination (`?page=1&limit=20`).
    *   Implement in-memory caching for the file contents, invalidating only when files change.
    *   Store metadata in a lightweight index (e.g., a single JSON file or a database like SQLite) instead of reading every file to get lists.

### 2. Large Payload Size (Medium)
*   **Location:** `web_app/src/App.tsx`
*   **Issue:** The frontend fetches the entire dataset, including the full content of every Markdown file, on initial load.
*   **Impact:** High network bandwidth usage and increased memory consumption in the browser.
*   **Recommendation:**
    *   Modify the list API to return only metadata (ID, title, date, type).
    *   Fetch full content only when an artifact is selected (`GET /api/artifacts/:id`).

### 3. Client-Side Filtering (Low)
*   **Location:** `web_app/src/App.tsx`
*   **Issue:** Filtering artifacts (e.g., by type) happens in the browser after loading all data.
*   **Impact:** While responsive for small datasets, this contributes to the initial load heaviness.
*   **Recommendation:** Move filtering to the backend (e.g., `/api/artifacts?type=RAW_COMMIT`).

## Conclusion
The current architecture is a "Prototype" pattern suitable for < 50 artifacts. To support long-term usage, the system must transition to a "Database/Index" pattern where file reads are minimized and data is paginated.
