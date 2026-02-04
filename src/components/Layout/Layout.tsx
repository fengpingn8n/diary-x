import { type ReactNode } from 'react';
import { Sidebar } from './Sidebar';
import { RightPanel } from './RightPanel';

export function Layout({ children }: { children: ReactNode }) {
    return (
        <div className="flex min-h-screen w-full justify-center bg-background text-foreground selection:bg-neon-blue/20">
            {/* Background elements for depth */}
            <div className="fixed inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-neon-blue/5 via-background to-background z-0" />

            <div className="flex w-full max-w-[1400px] flex-col md:flex-row z-10 relative">
                {/* Left Sidebar */}
                <Sidebar />

                {/* Main Content */}
                <main className="flex-1 min-w-0 border-r border-white/5 pb-20 md:pb-0 relative">
                    {/* Header for Mobile (or sticky top bar) */}
                    <div className="sticky top-0 z-40 bg-background/60 backdrop-blur-xl p-4 border-b border-white/10 md:hidden">
                        <h2 className="text-lg font-orbitron font-bold text-neon-blue tracking-widest">DIARY-X</h2>
                    </div>

                    {children}
                </main>

                {/* Right Panel */}
                <RightPanel />
            </div>
        </div>
    );
}
