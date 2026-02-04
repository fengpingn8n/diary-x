// React import removed as it is unused
import { Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout/Layout';
import { ComposeBox } from './components/Feed/ComposeBox';
import { FeedList } from './components/Feed/FeedList';
import { CalendarPage } from './components/Calendar/CalendarPage';
import { MemoriesPage } from './components/Memories/MemoriesPage';

import { SettingsPage } from './components/Settings/SettingsPage';

function FeedPage() {
  return (
    <>
      <div className="sticky top-0 z-40 bg-background/80 backdrop-blur-md p-4 border-b border-border hidden md:block">
        <h2 className="text-lg font-bold">主页</h2>
      </div>
      <ComposeBox />
      <FeedList />
    </>
  );
}

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<FeedPage />} />
        <Route path="/calendar" element={<CalendarPage />} />
        <Route path="/memories" element={<MemoriesPage />} />
        <Route path="/settings" element={<SettingsPage />} />
      </Routes>
    </Layout>
  );
}

export default App;
