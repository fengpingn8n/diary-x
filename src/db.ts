import Dexie, { type Table } from 'dexie';

export interface Post {
    id?: number; // Changed to number to match Dexie ++id
    content: string;
    mood?: string;
    images: string[];
    createdAt: number;
    dateKey: string; // YYYY-MM-DD
    monthDay: string; // MM-DD for "On This Day" queries
}

export interface AppSetting {
    key: string;
    value: any;
}

export class DiaryDatabase extends Dexie {
    posts!: Table<Post>;
    settings!: Table<AppSetting>;

    constructor() {
        super('DiaryXDB');
        this.version(1).stores({
            posts: '++id, dateKey, createdAt'
        });

        this.version(2).stores({
            posts: '++id, dateKey, monthDay, createdAt'
        }).upgrade(trans => {
            return trans.table('posts').toCollection().modify((post: Post) => {
                const date = new Date(post.createdAt);
                const mm = String(date.getMonth() + 1).padStart(2, '0');
                const dd = String(date.getDate()).padStart(2, '0');
                post.monthDay = `${mm}-${dd}`;
            });
        });

        this.version(3).stores({
            settings: 'key'
        });
    }
}

export const db = new DiaryDatabase();
