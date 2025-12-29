import { format } from 'date-fns-tz';
import { enUS } from 'date-fns/locale';
import { Clock, Sun, Moon } from 'lucide-react';

interface ClockCardProps {
    zone: string;
    city: string;
    now: Date | null;
}

export default function ClockCard({ zone, city, now }: ClockCardProps) {
    if (!now) return <SkeletonCard />;

    const timeStr = format(now, 'HH:mm', { timeZone: zone, locale: enUS });
    const dateStr = format(now, 'EEEE, MMM d', { timeZone: zone, locale: enUS });
    const amPm = format(now, 'a', { timeZone: zone, locale: enUS });
    const hour = parseInt(format(now, 'H', { timeZone: zone, locale: enUS }), 10);

    const isNight = hour < 6 || hour >= 18;

    return (
        <div className="glass-card rounded-3xl p-6 relative overflow-hidden group transition-all hover:scale-[1.02] hover:bg-white/10">
            {/* Background decoration */}
            <div className={`absolute -right-10 -top-10 w-32 h-32 rounded-full blur-3xl transition-opacity duration-700 ${isNight ? 'bg-indigo-900/40' : 'bg-amber-500/20'}`} />

            <div className="relative z-10 flex flex-col h-full justify-between">
                <div className="flex justify-between items-start">
                    <div>
                        <h3 className="text-2xl font-bold tracking-tight text-white">{city}</h3>
                        <p className="text-slate-400 text-sm font-medium uppercase tracking-wider">{zone.split('/')[0]}</p>
                    </div>
                    <div className={`p-2 rounded-full ${isNight ? 'bg-indigo-500/20 text-indigo-300' : 'bg-amber-500/20 text-amber-300'}`}>
                        {isNight ? <Moon size={18} /> : <Sun size={18} />}
                    </div>
                </div>

                <div className="mt-8">
                    <div className="flex items-baseline gap-2">
                        <span className="text-6xl font-black tabular-nums tracking-tighter text-white">
                            {timeStr}
                        </span>
                        <span className="text-xl text-slate-400 font-medium">{amPm}</span>
                    </div>
                    <p className="text-slate-400 font-medium mt-1">{dateStr}</p>
                </div>
            </div>
        </div>
    );
}

function SkeletonCard() {
    return (
        <div className="glass-card rounded-3xl p-6 h-[200px] animate-pulse">
            <div className="flex justify-between">
                <div className="space-y-2">
                    <div className="h-8 w-32 bg-white/10 rounded-lg" />
                    <div className="h-4 w-20 bg-white/5 rounded-lg" />
                </div>
                <div className="h-8 w-8 bg-white/5 rounded-full" />
            </div>
            <div className="mt-10 space-y-3">
                <div className="h-16 w-48 bg-white/10 rounded-xl" />
                <div className="h-4 w-32 bg-white/5 rounded-lg" />
            </div>
        </div>
    );
}
