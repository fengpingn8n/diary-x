import { useState, useRef, type ChangeEvent } from 'react';
import TextareaAutosize from 'react-textarea-autosize';
import { Image, Send, X, Terminal } from 'lucide-react';
import { MoodPicker } from '../Shared/MoodPicker';
import { usePosts } from '../../hooks/usePosts';
import { cn } from '../../lib/utils';

export function ComposeBox() {
    const [content, setContent] = useState('');
    const [mood, setMood] = useState<string | undefined>();
    const [images, setImages] = useState<string[]>([]);
    const { addPost } = usePosts();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleSubmit = async () => {
        if (!content.trim() && images.length === 0) return;
        await addPost(content, mood, images);
        // Reset
        setContent('');
        setMood(undefined);
        setImages([]);
    };

    const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.onloadend = () => {
                setImages((prev) => [...prev, reader.result as string]);
            };
            reader.readAsDataURL(file);
        }
    };

    const removeImage = (index: number) => {
        setImages(prev => prev.filter((_, i) => i !== index));
    };

    return (
        <div className="border-b border-white/5 bg-background/50 backdrop-blur-md p-6 relative group">
            {/* Tech Decoration - Isolated clipping */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 right-0 p-2 opacity-20">
                    <Terminal className="h-24 w-24 text-neon-blue" />
                </div>
            </div>

            <div className="flex gap-4 relative z-10">
                <div className="flex-1">
                    {/* Input Area */}
                    <TextareaAutosize
                        minRows={3}
                        placeholder="初始化日志条目... [等待输入]"
                        className="w-full resize-none bg-transparent text-lg font-mono text-foreground placeholder:text-muted-foreground/50 focus:outline-none tracking-wide"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                    />

                    {/* Image Previews */}
                    {images.length > 0 && (
                        <div className="mt-4 flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                            {images.map((img, i) => (
                                <div key={i} className="relative h-24 w-24 flex-shrink-0 group">
                                    <div className="absolute inset-0 border border-neon-blue/30 rounded-lg pointer-events-none z-20"></div>
                                    <img src={img} alt="preview" className="h-full w-full rounded-lg object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                                    <button
                                        onClick={() => removeImage(i)}
                                        className="absolute -right-2 -top-2 rounded-none bg-destructive text-destructive-foreground p-1 shadow-sm hover:bg-destructive/90 z-30 transform hover:scale-110 transition-transform"
                                    >
                                        <X className="h-3 w-3" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}

                    <div className="mt-6 flex items-center justify-between border-t border-white/5 pt-4">
                        <div className="flex items-center gap-4">
                            {/* Image Upload */}
                            <button
                                onClick={() => fileInputRef.current?.click()}
                                className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-neon-blue/80 hover:text-neon-blue hover:bg-neon-blue/10 transition-colors uppercase tracking-wider font-orbitron"
                                title="Add Visual Data"
                            >
                                <Image className="h-4 w-4" />
                                <span className="text-xs">ATTACH_IMG</span>
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    className="hidden"
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                />
                            </button>

                            {/* Mood Picker */}
                            <MoodPicker selectedMood={mood} onSelect={setMood} />
                        </div>

                        <button
                            onClick={handleSubmit}
                            disabled={!content.trim() && images.length === 0}
                            className={cn(
                                "group relative px-6 py-2 overflow-hidden bg-transparent border border-neon-blue/50 hover:border-neon-blue text-neon-blue text-sm font-orbitron font-bold tracking-widest uppercase transition-all",
                                "disabled:opacity-30 disabled:cursor-not-allowed disabled:border-muted",
                                "hover:shadow-[0_0_15px_rgba(0,243,255,0.3)]"
                            )}
                        >
                            <span className="relative z-10 flex items-center gap-2">
                                UPLOAD <Send className="h-3 w-3 group-hover:translate-x-1 transition-transform" />
                            </span>
                            <div className="absolute inset-0 bg-neon-blue/10 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300"></div>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
