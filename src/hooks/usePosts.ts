import { useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db, type Post } from '../db';
import { format } from 'date-fns';

export function usePosts() {
    const [limit, setLimit] = useState(20);

    const posts = useLiveQuery(
        () => db.posts.orderBy('createdAt').reverse().limit(limit).toArray(),
        [limit]
    );

    const loadMore = () => setLimit(prev => prev + 20);

    const addPost = async (content: string, mood?: string, images: string[] = []) => {
        const now = new Date();
        const newPost: Post = {
            content,
            mood,
            images,
            createdAt: now.getTime(),
            dateKey: format(now, 'yyyy-MM-dd'),
            monthDay: format(now, 'MM-dd'),
        };
        await db.posts.add(newPost);

        // Trigger auto-save
        try {
            const { autoSavePosts } = await import('../utils/fileSystem');
            const allPosts = await db.posts.toArray();
            await autoSavePosts(allPosts);
        } catch (err) {
            console.error('Auto-save trigger failed:', err);
        }
    };

    const deletePost = async (id: string) => {
        await db.posts.delete(Number(id));
    };

    return {
        posts,
        addPost,
        deletePost,
        loadMore,
        hasMore: posts && posts.length >= limit // Simple heuristic
    };
}
