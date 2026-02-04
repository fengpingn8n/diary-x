// React import removed

export function RightPanel() {
    return (
        <aside className="hidden h-screen w-[350px] sticky top-0 border-l border-border p-6 lg:block bg-background/30 backdrop-blur-sm">

            {/* Search */}
            <div className="relative mb-8 group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-neon-blue/50 text-sm">🔍</span>
                </div>
                <div className="w-full rounded-md bg-secondary/20 border border-white/5 py-2 pl-10 pr-4 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-neon-blue transition-all group-hover:bg-secondary/30">
                    检索数据库...
                </div>
            </div>

            {/* Stats Widget */}
            <div className="mb-6 rounded-lg glass-panel p-5 relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-1 h-full bg-neon-blue/50"></div>
                <h3 className="mb-2 text-md font-orbitron font-bold text-neon-blue tracking-wider uppercase">航行记录</h3>
                <p className="text-sm text-muted-foreground font-mono leading-relaxed">
                    暂无日志数据。
                    <br />
                    初始化记录程式以开始同步...
                </p>
            </div>

            {/* Calendar Mini Placeholder */}
            <div className="rounded-lg glass-panel p-5 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-neon-purple/50"></div>
                <h3 className="mb-3 text-md font-orbitron font-bold text-neon-purple tracking-wider">SYSTEM.DATE: 2026</h3>
                <div className="flex h-32 items-center justify-center text-xs text-muted-foreground bg-black/40 rounded border border-white/5 font-mono">
                    [ CALENDAR_MODULE_OFFLINE ]
                </div>
            </div>
        </aside>
    );
}
