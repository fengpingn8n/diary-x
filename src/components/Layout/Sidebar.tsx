import { type ReactNode, type ReactElement, cloneElement } from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Calendar, History, Settings, Activity } from 'lucide-react';
import { cn } from '../../lib/utils';

export function Sidebar() {
    return (
        <aside className="fixed bottom-0 left-0 z-50 w-full border-t border-border bg-background/80 backdrop-blur-md md:sticky md:top-0 md:h-screen md:w-[275px] md:border-r md:border-t-0 md:bg-transparent">
            <div className="flex h-full flex-row justify-around md:flex-col md:justify-start md:px-4 md:py-6">
                {/* Logo */}
                <div className="hidden px-4 pb-8 md:block">
                    <h1 className="flex items-center gap-3 text-2xl font-bold tracking-wider font-orbitron text-neon-blue">
                        <Activity className="h-8 w-8 animate-pulse-slow" />
                        <span className="neon-text">DIARY-X</span>
                    </h1>
                </div>

                {/* Navigation */}
                <nav className="flex w-full flex-row justify-around gap-2 md:flex-col md:justify-start md:space-y-3">
                    <NavItem to="/" icon={<Home />} label="私人日记" />
                    <NavItem to="/calendar" icon={<Calendar />} label="时间轴" />
                    <NavItem to="/memories" icon={<History />} label="记忆回廊" />
                    <div className="hidden md:block md:flex-1" /> {/* Spacer */}
                    <NavItem to="/settings" icon={<Settings />} label="系统配置" />
                </nav>
            </div>
        </aside>
    );
}

function NavItem({ to, icon, label }: { to: string; icon: ReactNode; label: string }) {
    return (
        <NavLink
            to={to}
            className={({ isActive }) =>
                cn(
                    "group flex items-center gap-4 rounded-md p-3 text-lg transition-all duration-300 md:px-4 md:py-3 border border-transparent",
                    isActive
                        ? "bg-primary/10 text-neon-blue border-neon-blue/30 shadow-[0_0_15px_rgba(0,243,255,0.15)]"
                        : "text-muted-foreground hover:text-foreground hover:bg-secondary/20 hover:border-white/10"
                )
            }
        >
            {cloneElement(icon as ReactElement<{ className: string }>, {
                className: "h-6 w-6 transition-transform duration-300 group-hover:scale-110"
            })}
            <span className="hidden md:inline font-mono tracking-wide">{label}</span>
        </NavLink>
    );
}
