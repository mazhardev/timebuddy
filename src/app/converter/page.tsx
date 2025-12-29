'use client';

import { useState } from 'react';
import Navigation from '@/components/Navigation';
import { POPULAR_TIMEZONES, getCityName } from '@/lib/time-utils';
import { format as formatTz, toZonedTime, fromZonedTime } from 'date-fns-tz';
import { enUS } from 'date-fns/locale';
import { Plus, X, ArrowRightLeft, Calendar } from 'lucide-react';

export default function Converter() { // Renamed from separate component file to page
    const [baseZone, setBaseZone] = useState('UTC');
    const [baseTime, setBaseTime] = useState<string>(() => {
        // Initial time as current local time formatted for input
        const now = new Date();
        return now.toISOString().slice(0, 16); // YYYY-MM-DDThh:mm
    });

    const [targetZones, setTargetZones] = useState<string[]>(['America/New_York', 'Europe/London', 'Asia/Tokyo']);

    const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setBaseTime(e.target.value);
    };

    const addZone = (zone: string) => {
        if (!targetZones.includes(zone)) {
            setTargetZones([...targetZones, zone]);
        }
    };

    const removeZone = (zone: string) => {
        setTargetZones(targetZones.filter(z => z !== zone));
    };

    // Calculate converted times
    // 1. Parse base time input as a Date object in the Base Zone
    // The input is "YYYY-MM-DDThh:mm" (local time string of the browser technically, but we treat it as time in baseZone)

    const getConvertedTimeNode = (zone: string) => {
        try {
            // 1. Interpret baseTime string as time in baseZone
            // fromZonedTime helper converts a date-like string (or Date) interpreted in a specific time zone to UTC
            const utcDate = fromZonedTime(baseTime, baseZone);

            // 2. Convert UTC to target zone
            // toZonedTime returns a Date that "looks like" the time in the target zone (shifted)
            // Check if different days
            // We use formatTz with timeZone option to be safe and accurate

            const timeStr = formatTz(utcDate, 'HH:mm', { timeZone: zone, locale: enUS });
            const dateStr = formatTz(utcDate, 'EEE, MMM d', { timeZone: zone, locale: enUS });
            const amPm = formatTz(utcDate, 'a', { timeZone: zone, locale: enUS });

            // Calculate offset difference
            const baseOffset = fromZonedTime(baseTime, baseZone).getTime();
            // This is tricky. simpler to just formatting.

            return (
                <div key={zone} className="flex justify-between items-center p-4 bg-white/5 rounded-xl border border-white/10 mb-3 animate-in fade-in slide-in-from-bottom-2">
                    <div>
                        <div className="font-bold text-lg text-white">{getCityName(zone)}</div>
                        <div className="text-xs text-slate-400">{zone}</div>
                    </div>
                    <div className="text-right flex items-center gap-4">
                        <div>
                            <div className="flex items-baseline justify-end gap-1">
                                <span className="text-2xl font-mono text-white">{timeStr}</span>
                                <span className="text-sm text-slate-400">{amPm}</span>
                            </div>
                            <div className="text-xs text-slate-500">{dateStr}</div>
                        </div>
                        <button onClick={() => removeZone(zone)} className="p-2 hover:bg-white/10 rounded-full text-slate-500 hover:text-red-400 transition-colors">
                            <X size={16} />
                        </button>
                    </div>
                </div>
            );
        } catch (e) {
            console.error(e);
            return null;
        }
    };

    return (
        <main className="min-h-screen bg-slate-950">
            <Navigation />

            <div className="max-w-4xl mx-auto px-4 py-12">
                <header className="mb-12">
                    <h1 className="text-4xl font-bold text-white mb-4">Time Zone Converter</h1>
                    <p className="text-slate-400">Compare times across the world easily.</p>
                </header>

                <div className="glass-card rounded-3xl p-8 mb-8">
                    <div className="grid md:grid-cols-2 gap-8 items-center">
                        <div>
                            <label className="block text-sm font-medium text-slate-400 mb-2">Base Time</label>
                            <input
                                type="datetime-local"
                                value={baseTime}
                                onChange={handleTimeChange}
                                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-400 mb-2">Base Zone</label>
                            <select
                                value={baseZone}
                                onChange={(e) => setBaseZone(e.target.value)}
                                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                            >
                                {POPULAR_TIMEZONES.map(z => (
                                    <option key={z} value={z}>{getCityName(z)} ({z})</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                <div className="space-y-4">
                    <h2 className="text-xl font-semibold text-white mb-4">Target Zones</h2>
                    {targetZones.map(zone => getConvertedTimeNode(zone))}

                    <div className="mt-6">
                        <h3 className="text-sm font-medium text-slate-400 mb-3">Add Zone</h3>
                        <div className="flex gap-2 flex-wrap">
                            {POPULAR_TIMEZONES.filter(z => !targetZones.includes(z)).map(z => (
                                <button
                                    key={z}
                                    onClick={() => addZone(z)}
                                    className="flex items-center gap-2 px-3 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-sm text-slate-300 transition-colors"
                                >
                                    <Plus size={14} />
                                    {getCityName(z)}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
