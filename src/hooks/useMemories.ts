import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db';
import { format } from 'date-fns';

export function useMemories() {
    const todayMonthDay = format(new Date(), 'MM-dd');
    const currentYear = new Date().getFullYear();

    const memories = useLiveQuery(async () => {
        // 1. Find all posts from "this day" (MM-DD)
        const postsOnThisDay = await db.posts
            .where('monthDay')
            .equals(todayMonthDay)
            .toArray();

        // 2. Filter out posts from the current year (these are just "today's posts", not memories)
        return postsOnThisDay.filter(post => {
            const postYear = new Date(post.createdAt).getFullYear();
            return postYear < currentYear;
        }).sort((a, b) => b.createdAt - a.createdAt); // Newest first
    });

    return { memories };
}
