import Link from 'next/link';
import { Clock, Globe, CalendarDays } from 'lucide-react';

export default function Navigation() {
    return (
        <nav className="border-b border-white/10 bg-slate-950/50 backdrop-blur-md sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-indigo-500/20 rounded-xl border border-indigo-500/30">
                            <Clock className="w-6 h-6 text-indigo-400" />
                        </div>
                        <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
                            TimeBuddy
                        </span>
                    </div>

                    <div className="flex gap-1 bg-white/5 p-1 rounded-full border border-white/10">
                        <NavLink href="/" icon={<Clock className="w-4 h-4" />} label="Clock" />
                        {/* Future features: Converter, Planner */}
                        <NavLink href="/converter" icon={<Globe className="w-4 h-4" />} label="Converter" />
                        <NavLink href="/planner" icon={<CalendarDays className="w-4 h-4" />} label="Planner" />
                    </div>
                </div>
            </div>
        </nav>
    );
}

function NavLink({ href, icon, label }: { href: string; icon: React.ReactNode; label: string }) {
    return (
        <Link
            href={href}
            className="flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium transition-all hover:bg-white/10 text-slate-400 hover:text-white data-[active=true]:bg-indigo-600 data-[active=true]:text-white"
        >
            {icon}
            <span>{label}</span>
        </Link>
    );
}
