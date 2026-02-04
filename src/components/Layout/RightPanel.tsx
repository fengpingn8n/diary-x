import { useSearchParams } from 'react-router-dom';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../../db';
import { format, differenceInDays } from 'date-fns';
import { Search, History, BookOpen } from 'lucide-react';

export function RightPanel() {
    const [searchParams, setSearchParams] = useSearchParams();

    // 1. Search Logic
    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setSearchParams(prev => {
            if (value) {
                prev.set('q', value);
            } else {
                prev.delete('q');
            }
            return prev;
        }, { replace: true });
    };

    // 2. Stats Logic
    const stats = useLiveQuery(async () => {
        const count = await db.posts.count();
        const firstPost = await db.posts.orderBy('createdAt').first();
        const daysActive = firstPost
            ? differenceInDays(new Date(), new Date(firstPost.createdAt)) + 1
            : 0;
        return { count, daysActive };
    });

    // 3. On This Day Logic
    const memories = useLiveQuery(async () => {
        const todayAPI = format(new Date(), 'MM-dd');
        const currentYear = format(new Date(), 'yyyy');

        const posts = await db.posts.where('monthDay').equals(todayAPI).toArray();
        // Filter out posts from current year to show only "past" memories
        return posts.filter(p => format(new Date(p.createdAt), 'yyyy') !== currentYear);
    });

    return (
        <aside className="hidden h-screen w-[350px] sticky top-0 border-l border-border p-6 lg:block bg-background/30 backdrop-blur-sm">

            {/* Search */}
            <div className="relative mb-8 group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-4 w-4 text-neon-blue/50" />
                </div>
                <input
                    type="text"
                    placeholder="检索数据库..."
                    defaultValue={searchParams.get('q') || ''}
                    onChange={handleSearch}
                    className="w-full rounded-md bg-secondary/20 border border-white/5 py-2 pl-10 pr-4 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-neon-blue transition-all group-hover:bg-secondary/30 placeholder:text-muted-foreground/50"
                />
            </div>

            {/* Stats Widget */}
            <div className="mb-6 rounded-lg glass-panel p-5 relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-1 h-full bg-neon-blue/50"></div>
                <h3 className="mb-4 text-md font-orbitron font-bold text-neon-blue tracking-wider uppercase flex items-center gap-2">
                    <BookOpen className="h-4 w-4" />
                    日志记录
                </h3>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <div className="text-xs text-muted-foreground font-mono mb-1">TOTAL_LOGS</div>
                        <div className="text-2xl font-bold font-orbitron text-white">
                            {stats?.count || 0}
                        </div>
                    </div>
                    <div>
                        <div className="text-xs text-muted-foreground font-mono mb-1">DAYS_ACTIVE</div>
                        <div className="text-2xl font-bold font-orbitron text-white">
                            {stats?.daysActive || 0}
                        </div>
                    </div>
                </div>
            </div>

            {/* On This Day Widget */}
            <div className="rounded-lg glass-panel p-5 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-neon-purple/50"></div>
                <h3 className="mb-3 text-md font-orbitron font-bold text-neon-purple tracking-wider flex items-center gap-2">
                    <History className="h-4 w-4" />
                    去年今日
                </h3>

                {memories && memories.length > 0 ? (
                    <div className="space-y-3">
                        {memories.slice(0, 3).map(post => (
                            <div key={post.id} className="text-xs border-l border-white/10 pl-3 py-1">
                                <div className="text-neon-purple/70 font-mono mb-1">
                                    {format(new Date(post.createdAt), 'yyyy')}
                                </div>
                                <div className="text-muted-foreground line-clamp-2">
                                    {post.content}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="flex h-32 items-center justify-center text-xs text-muted-foreground bg-black/40 rounded border border-white/5 font-mono flex-col gap-2">
                        <span className="opacity-50">NO_DATA_FOUND</span>
                        <span className="text-[10px] opacity-30">ARCHIVE_OFFLINE</span>
                    </div>
                )}
            </div>
        </aside>
    );
}
