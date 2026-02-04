import { usePosts } from '../../hooks/usePosts';
import { PostCard } from './PostCard';

export function FeedList() {
    const { posts, loadMore, hasMore } = usePosts();

    if (!posts) {
        return (
            <div className="p-12 text-center">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-neon-blue"></div>
                <p className="mt-4 text-sm font-mono text-neon-blue/80 animate-pulse">SYSTEM_SYNCING...</p>
            </div>
        );
    }

    if (posts.length === 0) {
        return (
            <div className="p-12 text-center text-muted-foreground border-b border-white/5">
                <p className="text-xl font-orbitron font-bold text-white/20 tracking-widest">NO_DATA</p>
                <p className="mt-2 text-sm font-mono text-white/40">DATABASE_EMPTY // AWAITING_INPUT</p>
            </div>
        );
    }

    return (
        <div className="pb-20 md:pb-8">
            {posts.map((post) => (
                <PostCard key={post.id} post={post} />
            ))}

            {hasMore && (
                <div className="p-6 text-center">
                    <button
                        onClick={loadMore}
                        className="text-xs font-mono text-neon-blue border border-neon-blue/30 px-6 py-2 hover:bg-neon-blue/10 transition-colors uppercase tracking-widest"
                    >
                        [ LOAD_MORE_DATA ]
                    </button>
                </div>
            )}

            {!hasMore && posts.length > 5 && (
                <div className="p-8 text-center">
                    <span className="text-[10px] font-mono text-muted-foreground/50 tracking-[0.2em] border-t border-b border-white/5 py-1 px-4">
                        END_OF_ARCHIVE
                    </span>
                </div>
            )}
        </div>
    );
}
