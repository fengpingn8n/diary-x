# Design: Diary-X

## Technical Approach
*   **State Manager**: React Context or lightweight Zustand (optional, Context is likely enough).
*   **Database**: `dexie` for easy IndexedDB interactions.
*   **Styling**: Tailwind CSS for rapid UI development. Typography: Inter.

## Architecture Decisions
*   **Dexie over LocalStorage**: Images can be large; LocalStorage (5MB limit) is insufficient. IndexedDB is robust.
*   **Virtualization**: For "Infinite Scroll", initially standard pagination/load-more is fine. If performance drops, implement `react-window`. MVP: Simple "Load More" button or IntersectionObserver.

## UI Layout
*   **Sidebar (Left)**:
    *   Logo/Brand (Diary-X)
    *   Home (Feed)
    *   Calendar (View by date)
    *   Memories (On This Day)
    *   Settings
*   **Main (Center)**:
    *   **Compose Box**: Top of feed. Textarea auto-resize. Mood picker popover. Image upload button. Post button.
    *   **Feed**: List of `PostCard` components.
*   **Widgets (Right - Desktop)**:
    *   **Calendar Widget**: Small month view to click and filter feed.
    *   **Stats**: "365 days written", "Top moods".

## File Structure
```
src/
  components/
    Layout/
      Sidebar.tsx
      RightPanel.tsx
    Feed/
      ComposeBox.tsx
      PostCard.tsx
      FeedList.tsx
    Shared/
      Button.tsx
      MoodPicker.tsx
  db/
    db.ts (Dexie schema)
  hooks/
    usePosts.ts
    useOnThisDay.ts
  App.tsx
```
