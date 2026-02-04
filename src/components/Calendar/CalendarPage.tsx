import { useState, useMemo } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, addMonths, subMonths } from 'date-fns';
import { zhCN } from 'date-fns/locale';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { db } from '../../db';
import { cn } from '../../lib/utils';
import { PostCard } from '../Feed/PostCard';

export function CalendarPage() {
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);

    // Get all dates that have posts
    const activeDates = useLiveQuery(async () => {
        const keys = await db.posts.orderBy('dateKey').uniqueKeys();
        return new Set(keys as string[]);
    }, []);

    // Get posts for selected date
    const selectedPosts = useLiveQuery(async () => {
        if (!selectedDate) return [];
        const dateKey = format(selectedDate, 'yyyy-MM-dd');
        return await db.posts.where('dateKey').equals(dateKey).toArray();
    }, [selectedDate]);

    const days = useMemo(() => {
        return eachDayOfInterval({
            start: startOfMonth(currentMonth),
            end: endOfMonth(currentMonth),
        });
    }, [currentMonth]);

    const nextMonth = () => setCurrentMonth(prev => addMonths(prev, 1));
    const prevMonth = () => setCurrentMonth(prev => subMonths(prev, 1));

    return (
        <div className="min-h-screen pb-20">
            <div className="sticky top-0 z-40 bg-background/80 backdrop-blur-md p-4 border-b border-border flex items-center justify-between">
                <h2 className="text-lg font-bold">日历</h2>
                <div className="flex items-center gap-2">
                    <button onClick={prevMonth} className="p-1 hover:bg-secondary rounded-full"><ChevronLeft /></button>
                    <span className="font-semibold w-32 text-center">{format(currentMonth, 'yyyy年 MMMM', { locale: zhCN })}</span>
                    <button onClick={nextMonth} className="p-1 hover:bg-secondary rounded-full"><ChevronRight /></button>
                </div>
            </div>

            <div className="p-4">
                {/* Calendar Grid */}
                <div className="grid grid-cols-7 gap-2 text-center mb-8">
                    {/* Headers */}
                    {['日', '一', '二', '三', '四', '五', '六'].map(d => (
                        <div key={d} className="text-sm font-bold text-muted-foreground py-2">{d}</div>
                    ))}

                    {/* Days */}
                    {days.map((day: Date) => {
                        const dateKey = format(day, 'yyyy-MM-dd');
                        const hasPost = activeDates?.has(dateKey);
                        const isSelected = selectedDate && isSameDay(day, selectedDate);
                        const isToday = isSameDay(day, new Date());

                        return (
                            <button
                                key={dateKey}
                                onClick={() => setSelectedDate(day)}
                                className={cn(
                                    "aspect-square rounded-xl flex flex-col items-center justify-center relative transition-all",
                                    "hover:bg-secondary",
                                    isSelected ? "bg-primary text-primary-foreground hover:bg-primary/90" : "bg-card border border-border",
                                    isToday && !isSelected && "ring-2 ring-primary ring-offset-2"
                                )}
                            >
                                <span className="text-sm font-medium">{format(day, 'd')}</span>
                                {hasPost && (
                                    <div className={cn("h-1.5 w-1.5 rounded-full mt-1", isSelected ? "bg-primary-foreground" : "bg-primary")}></div>
                                )}
                            </button>
                        )
                    })}
                </div>

                {/* Selected Day Posts */}
                {selectedDate && (
                    <div className="animate-in slide-in-from-bottom-5 duration-300 space-y-4">
                        <h3 className="font-bold text-xl px-2">
                            {format(selectedDate, 'M月d日', { locale: zhCN })} 的日记
                        </h3>
                        {selectedPosts && selectedPosts.length > 0 ? (
                            selectedPosts.map(post => <PostCard key={post.id} post={post} />)
                        ) : (
                            <div className="p-8 text-center text-muted-foreground bg-secondary/20 rounded-xl">
                                这一天没有日记。
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
