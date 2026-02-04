import { useState } from 'react';
import { Activity, X } from 'lucide-react';
import { cn } from '../../lib/utils';

import { MOOD_OPTIONS } from '../../constants/moods';

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
                    <span className="font-mono text-xs font-bold tracking-wider flex items-center gap-1.5">
                        <activeMood.icon className="h-3 w-3" />
                        {activeMood.label}
                    </span>
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
                                        "w-full text-left px-3 py-1.5 text-xs font-mono border border-transparent transition-all flex items-center gap-2",
                                        mood.color,
                                        selectedMood === mood.key ? "bg-white/5 border-white/10 shadow-[0_0_10px_rgba(0,0,0,0.5)]" : "opacity-70 hover:opacity-100"
                                    )}
                                >
                                    <mood.icon className="h-3 w-3" />
                                    <span>[{mood.label}]</span>
                                </button>
                            ))}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
