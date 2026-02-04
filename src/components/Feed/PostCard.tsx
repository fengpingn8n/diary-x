import { useState } from 'react';
import { format } from 'date-fns';
import { zhCN } from 'date-fns/locale';
import { MoreHorizontal, Trash2, Share2, Hash } from 'lucide-react';
import type { Post } from '../../db';
import { usePosts } from '../../hooks/usePosts';
import { cn } from '../../lib/utils';

import { MOOD_MAP } from '../../constants/moods';

interface PostCardProps {
    post: Post;
}

export function PostCard({ post }: PostCardProps) {
    const { deletePost } = usePosts();
    const [showMenu, setShowMenu] = useState(false);
    const [isHovered, setIsHovered] = useState(false);

    const moodInfo = post.mood ? MOOD_MAP[post.mood] : null;

    return (
        <article
            className="group relative border-b border-white/5 bg-background/40 hover:bg-background/60 transition-colors p-6 overflow-hidden"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Hover Tech Border */}
            <div className={cn(
                "absolute left-0 top-0 bottom-0 w-1 bg-neon-blue/50 transition-transform duration-300",
                isHovered ? "translate-x-0" : "-translate-x-full"
            )} />

            <div className="flex gap-4">
                {/* Avatar / Identity */}
                <div className="flex-shrink-0">
                    <div className="h-10 w-10 rounded bg-secondary/20 flex items-center justify-center border border-white/10 text-neon-blue font-bold tracking-tighter">
                        <span className="text-xs">USR</span>
                    </div>
                </div>

                <div className="flex-1 min-w-0">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                            <span className="font-bold text-neon-blue tracking-wide text-sm font-orbitron">COMMANDER</span>

                            <time className="text-xs font-mono text-muted-foreground/70">
                                {format(new Date(post.createdAt), 'yyyy.MM.dd // HH:mm', { locale: zhCN })}
                            </time>

                            {moodInfo && (
                                <span className={cn("ml-2 px-2 py-0.5 rounded-[2px] text-[10px] font-mono border uppercase tracking-wider flex items-center gap-1.5", moodInfo.color)}>
                                    <moodInfo.icon className="h-3 w-3" />
                                    {moodInfo.label}
                                </span>
                            )}
                        </div>

                        <div className="relative">
                            <button
                                onClick={() => setShowMenu(!showMenu)}
                                className="group rounded-full p-2 text-muted-foreground hover:text-neon-blue transition-colors"
                            >
                                <MoreHorizontal className="h-4 w-4" />
                            </button>
                            {showMenu && (
                                <div className="absolute right-0 top-8 z-10 w-32 rounded bg-black/90 border border-neon-blue/30 backdrop-blur-xl p-1 shadow-[0_0_15px_rgba(0,243,255,0.1)]">
                                    <button
                                        onClick={() => deletePost(String(post.id))}
                                        className="flex w-full items-center gap-2 rounded-sm px-2 py-2 text-xs font-mono text-destructive hover:bg-destructive/10 uppercase tracking-wider"
                                    >
                                        <Trash2 className="h-3 w-3" />
                                        Delete
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Content */}
                    <div className="whitespace-pre-wrap text-[15px] leading-relaxed text-foreground/90 font-sans">
                        {post.content}
                    </div>

                    {/* Images */}
                    {post.images && post.images.length > 0 && (
                        <div className={cn(
                            "mt-4 grid gap-2",
                            post.images.length === 1 ? "grid-cols-1" : "grid-cols-2"
                        )}>
                            {post.images.map((img, i) => (
                                <div key={i} className="relative group/image overflow-hidden rounded-sm border border-white/10">
                                    <img
                                        src={img}
                                        alt="Post attachment"
                                        className="h-full w-full object-cover max-h-[400px] transition-transform duration-500 group-hover/image:scale-105"
                                    />
                                    <div className="absolute inset-0 bg-neon-blue/5 opacity-0 group-hover/image:opacity-100 transition-opacity pointer-events-none"></div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Footer Actions */}
                    <div className="mt-4 flex items-center gap-6 border-t border-white/5 pt-3 opacity-60 hover:opacity-100 transition-opacity">
                        <ActionButton icon={<Share2 />} label="SHARE" />
                        <ActionButton icon={<Hash />} label="TAG" />
                    </div>
                </div>
            </div>
        </article>
    );
}

function ActionButton({ icon, label }: { icon: any, label: string }) {
    return (
        <button className="flex items-center gap-1.5 text-[10px] font-mono text-muted-foreground hover:text-neon-blue transition-colors">
            {icon && <icon.type className="h-3 w-3" />}
            <span className="tracking-widest">{label}</span>
        </button>
    )
}
