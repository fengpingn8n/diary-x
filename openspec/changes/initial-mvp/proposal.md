# Proposal: Diary-X (Private Twitter-style Diary)

## Intent
Create a private, personal diary application that mimics the concise, low-friction user experience of Twitter/X. The goal is to lower the barrier to journaling by allowing short, frequent updates with multimedia and mood tracking.

## Scope
### In-Scope
*   **Timeline Feed**: Infinite scroll of all diary entries.
*   **Composition**: "Tweet"-style input box with character counter (optional), mood selector, and image upload.
*   **Media**: Support for uploading and displaying images (stored locally).
*   **Navigation**: Sidebar navigation.
*   **Calendar**: Quick jump to specific dates.
*   **Recall**: "On This Day" feature to show entries from previous years.
*   **Persistence**: All data stored locally in browser (IndexedDB/LocalStorage).

### Out-of-Scope
*   Cloud sync/Auth (Private & Local only for MVP).
*   Social features (Likes/Retweets/Comments - it's a diary).
*   Video upload (Images only for MVP).

## Approach
*   **Frontend**: React + Vite + Tailwind CSS.
*   **Storage**: Dexie.js (IndexedDB wrapper) for efficient storage of posts and images.
*   **UI**: Minimalist, "X" inspired dark/light mode aesthetics.
