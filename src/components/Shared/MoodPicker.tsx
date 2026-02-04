import { useState } from 'react';
import { Activity, X } from 'lucide-react';
import { cn } from '../../lib/utils';

// Consistent with PostCard moodMap
const MOOD_OPTIONS = [
    { key: 'happy', label: 'JOY', color: 'text-neon-green border-neon-green/50 hover:bg-neon-green/10' },
    { key: 'energetic', label: 'ENERGY', color: 'text-yellow-400 border-yellow-400/50 hover:bg-yellow-400/10' },
    { key: 'calm', label: 'CALM', color: 'text-cyan-300 border-cyan-300/50 hover:bg-cyan-300/10' },
    { key: 'neutral', label: 'NEUTRAL', color: 'text-gray-400 border-gray-400/50 hover:bg-gray-400/10' },
    { key: 'sad', label: 'SORROW', color: 'text-blue-400 border-blue-400/50 hover:bg-blue-400/10' },
];

interface MoodPickerProps {
    selectedMood?: string;
    onSelect: (mood: string) => void;
}

export function MoodPicker({ selectedMood, onSelect }: MoodPickerProps) {
    const [isOpen, setIsOpen] = useState(false);

    const activeMood = MOOD_OPTIONS.find(m => m.key === selectedMood);

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={cn(
                    "flex items-center gap-2 px-3 py-1.5 rounded-sm border border-dashed transition-all duration-300",
                    activeMood
                        ? cn("bg-background border-solid", activeMood.color)
                        : "border-muted-foreground/30 text-muted-foreground hover:text-neon-blue hover:border-neon-blue/50"
                )}
                title="INPUT_EMOTIONAL_STATE"
            >
                {activeMood ? (
                    <span className="font-mono text-xs font-bold tracking-wider">{activeMood.label}</span>
                ) : (
                    <>
                        <Activity className="h-4 w-4" />
                        <span className="font-orbitron text-[10px] tracking-widest hidden md:inline">EMOTION</span>
                    </>
                )}
            </button>

            {isOpen && (
                <>
                    <div
                        className="fixed inset-0 z-10"
                        onClick={() => setIsOpen(false)}
                    />
                    <div className="absolute top-full left-0 z-20 mt-2 w-40 glass-panel border-neon-blue/20 p-2 animate-in fade-in zoom-in-95 duration-200">
                        <div className="text-[10px] text-neon-blue/50 font-mono mb-2 uppercase tracking-widest px-1 flex justify-between items-center">
                            <span>SELECT_STATE</span>
                            <X className="h-3 w-3 cursor-pointer hover:text-white" onClick={(e) => { e.stopPropagation(); setIsOpen(false); }} />
                        </div>
                        <div className="grid gap-1.5">
                            {MOOD_OPTIONS.map((mood) => (
                                <button
                                    key={mood.key}
                                    onClick={() => {
                                        onSelect(mood.key);
                                        setIsOpen(false);
                                    }}
                                    className={cn(
                                        "w-full text-left px-3 py-1.5 text-xs font-mono border border-transparent transition-all",
                                        mood.color,
                                        selectedMood === mood.key ? "bg-white/5 border-white/10 shadow-[0_0_10px_rgba(0,0,0,0.5)]" : "opacity-70 hover:opacity-100"
                                    )}
                                >
                                    [{mood.label}]
                                </button>
                            ))}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
