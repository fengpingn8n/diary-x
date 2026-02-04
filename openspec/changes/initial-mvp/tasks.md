# Tasks: Diary-X MVP

## 1. Infrastructure & Database
- [ ] 1.1 Install dependencies (`dexie`, `dexie-react-hooks`, `react-router-dom`, `lucide-react`, `date-fns`, `react-textarea-autosize`).
- [ ] 1.2 Configure Tailwind (`tailwind.config.js` with dark mode).
- [ ] 1.3 Setup Dexie DB (`src/db.ts`) with `posts` table schema.

## 2. UI Shell & Navigation
- [ ] 2.1 Create Layout components (`Sidebar`, `MainColumn`, `RightPanel`).
- [ ] 2.2 Setup Routing (Home, Calendar, Memories).
- [ ] 2.3 Implement Responsive Shell (Mobile: Bottom Nav, Desktop: 3-col).

## 3. Core Features: Compose & Feed
- [ ] 3.1 Build `ComposeBox` (Textarea, Mood Picker UI, Image Input).
- [ ] 3.2 Implement Post creation logic (save to Dexie).
- [ ] 3.3 Build `PostCard` (Display text, mood, images grid, date).
- [ ] 3.4 Build `FeedList` with `useLiveQuery` from Dexie.

## 4. Advanced Features
- [ ] 4.1 Implement "On This Day" logic (Filter posts by MM-DD).
- [ ] 4.2 Build Calendar Widget (Click date -> Filter feed).
- [ ] 4.3 Add Image Preview & Delete in Compose Box.

## 5. Polish
- [ ] 5.1 Empty States (No posts yet).
- [ ] 5.2 Mood Tags styling.
