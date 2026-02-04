import {
    Smile,
    Zap,
    Target,
    Sparkles,
    Wind,
    Minus,
    BatteryLow,
    AlertCircle,
    Frown,
    Flame,
    type LucideIcon
} from 'lucide-react';

export interface MoodOption {
    key: string;
    label: string;
    color: string;
    icon: LucideIcon;
}

export const MOOD_OPTIONS: MoodOption[] = [
    { key: 'happy', label: 'JOY', color: 'text-neon-green border-neon-green/50 hover:bg-neon-green/10', icon: Smile },
    { key: 'excited', label: 'EXCITED', color: 'text-neon-purple border-neon-purple/50 hover:bg-neon-purple/10', icon: Zap },
    { key: 'energetic', label: 'ENERGY', color: 'text-yellow-400 border-yellow-400/50 hover:bg-yellow-400/10', icon: Zap },
    { key: 'focused', label: 'FOCUS', color: 'text-neon-blue border-neon-blue/50 hover:bg-neon-blue/10', icon: Target },
    { key: 'creative', label: 'FLOW', color: 'text-pink-400 border-pink-400/50 hover:bg-pink-400/10', icon: Sparkles },
    { key: 'calm', label: 'CALM', color: 'text-cyan-300 border-cyan-300/50 hover:bg-cyan-300/10', icon: Wind },
    { key: 'neutral', label: 'NEUTRAL', color: 'text-gray-400 border-gray-400/50 hover:bg-gray-400/10', icon: Minus },
    { key: 'tired', label: 'LOW', color: 'text-orange-300 border-orange-300/50 hover:bg-orange-300/10', icon: BatteryLow },
    { key: 'anxious', label: 'ANXIETY', color: 'text-red-300 border-red-300/50 hover:bg-red-300/10', icon: AlertCircle },
    { key: 'sad', label: 'SORROW', color: 'text-blue-400 border-blue-400/50 hover:bg-blue-400/10', icon: Frown },
    { key: 'angry', label: 'RAGE', color: 'text-red-600 border-red-600/50 hover:bg-red-600/10', icon: Flame },
];

export const MOOD_MAP = MOOD_OPTIONS.reduce((acc, mood) => {
    acc[mood.key] = mood;
    return acc;
}, {} as Record<string, MoodOption>);
