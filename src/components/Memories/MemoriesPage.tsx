// React import removed
import { useMemories } from '../../hooks/useMemories';
import { PostCard } from '../Feed/PostCard';
import { format } from 'date-fns';
import { zhCN } from 'date-fns/locale';
import { History } from 'lucide-react';

export function MemoriesPage() {
    const { memories } = useMemories();
    const todayStr = format(new Date(), 'M月d日', { locale: zhCN });

    if (!memories) {
        return (
            <div className="p-12 text-center text-neon-blue/70 animate-pulse font-mono tracking-widest text-sm">
                SEARCHING_ARCHIVES...
            </div>
        );
    }

    return (
        <div>
            {/* Header */}
            <div className="sticky top-0 z-40 bg-background/80 backdrop-blur-md p-4 border-b border-white/10">
                <h2 className="text-xl font-orbitron font-bold text-neon-purple tracking-widest flex items-center gap-2">
                    <History className="h-5 w-5" />
                    TIME_CAPSULE <span className="text-sm font-mono text-muted-foreground ml-2 opacity-70">[{todayStr}]</span>
                </h2>
            </div>

            {memories.length === 0 ? (
                <div className="p-16 text-center">
                    <div className="mx-auto mb-6 h-20 w-20 rounded-full bg-secondary/20 flex items-center justify-center text-4xl border border-white/5 relative group">
                        <span className="opacity-50 group-hover:opacity-100 transition-opacity grayscale hover:grayscale-0">🕰️</span>
                        <div className="absolute inset-0 rounded-full border border-neon-purple/20 animate-ping opacity-20"></div>
                    </div>
                    <h3 className="text-xl font-orbitron font-bold text-white/50 tracking-widest uppercase">NO_TEMPORAL_DATA</h3>
                    <p className="max-w-xs mx-auto mt-3 text-xs font-mono text-muted-foreground/60 leading-relaxed">
                        // ARCHIVE_EMPTY
                        <br />
                        Create entries to populate future timelines.
                    </p>
                </div>
            ) : (
                <div className="relative">
                    {/* Timeline Line */}
                    <div className="absolute left-6 top-0 bottom-0 w-px bg-gradient-to-b from-neon-purple/50 via-neon-purple/10 to-transparent z-0 hidden md:block"></div>

                    {memories.map((post) => (
                        <div key={post.id} className="relative z-10">
                            {/* Year Separator */}
                            <div className="sticky top-[61px] z-30 bg-background/95 border-y border-neon-purple/30 px-6 py-2 backdrop-blur-md flex items-center gap-2">
                                <span className="h-2 w-2 bg-neon-purple rounded-full animate-pulse shadow-[0_0_10px_#bf00ff]"></span>
                                <span className="font-orbitron font-bold text-neon-purple tracking-widest">
                                    {new Date(post.createdAt).getFullYear()}
                                </span>
                                <span className="flex-1 h-px bg-neon-purple/20"></span>
                            </div>
                            <PostCard post={post} />
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
