# Spec: Diary Data Model

## Data Structures

### Post
*   `id`: UUID (string)
*   `content`: string (text content)
*   `mood`: string (emoji/tag, e.g., "😊", "😤", "🤔") - Optional
*   `images`: string[] (Array of Blob URLs or Base64 strings stored in IDB)
*   `createdAt`: number (Timestamp)
*   `dateKey`: string (YYYY-MM-DD, for indexing and calendar lookup)

### Settings
*   `theme`: 'light' | 'dark' | 'system'

## Features

### 1. Feed
*   **Order**: Reverse chronological (newest first).
*   **Pagination**: Infinite scroll query (load 20 at a time).

### 2. "On This Day"
*   **Logic**: Query posts where `dateKey` matches today's Month-Day but `year` < current year.

### 3. Image Handling
*   **Storage**: Images must be stored as Blobs in IndexedDB to avoid LocalStorage size limits.
*   **Display**: Grid layout (1, 2, 3, 4+ grid similar to X).
