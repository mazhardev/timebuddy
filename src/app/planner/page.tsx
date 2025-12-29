'use client';

import { useState } from 'react';
import Navigation from '@/components/Navigation';
import { POPULAR_TIMEZONES, getCityName } from '@/lib/time-utils';
import { format as formatTz, toZonedTime, fromZonedTime } from 'date-fns-tz';
import { addHours, startOfDay } from 'date-fns';
import { enUS } from 'date-fns/locale';
import { Plus, X, Users } from 'lucide-react';

export default function Planner() {
    const [selectedDate, setSelectedDate] = useState<string>(() => {
        return new Date().toISOString().slice(0, 10); // YYYY-MM-DD
    });

    const [zones, setZones] = useState<string[]>(['America/New_York', 'Europe/London', 'Asia/Dubai']);

    const addZone = (zone: string) => {
        if (!zones.includes(zone)) {
            setZones([...zones, zone]);
        }
    };

    const removeZone = (zone: string) => {
        setZones(zones.filter(z => z !== zone));
    };

    const hours = Array.from({ length: 24 }, (_, i) => i); // 0 to 23

    // Helper to get status of an hour in a zone
    // Work hours: 9-17 (Green)
    // Waking hours: 7-22 (Yellow)
    // Sleeping: 22-7 (Red/Gray)
    const getHourStatus = (hour24: number) => {
        if (hour24 >= 9 && hour24 < 17) return 'work';
        if (hour24 >= 7 && hour24 < 22) return 'awake';
        return 'sleep';
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'work': return 'bg-emerald-500/80 hover:bg-emerald-400';
            case 'awake': return 'bg-amber-500/50 hover:bg-amber-400';
            default: return 'bg-slate-800/50 hover:bg-slate-700';
        }
    };

    return (
        <main className="min-h-screen bg-slate-950">
            <Navigation />

            <div className="max-w-7xl mx-auto px-4 py-12">
                <header className="mb-12">
                    <h1 className="text-4xl font-bold text-white mb-4">Meeting Planner</h1>
                    <p className="text-slate-400">Find the perfect meeting time across time zones.</p>
                </header>

                <div className="mb-8 flex flex-col md:flex-row gap-6 justify-between items-start">
                    <div className="glass-card p-4 rounded-xl">
                        <label className="block text-sm font-medium text-slate-400 mb-2">Meeting Date</label>
                        <input
                            type="date"
                            value={selectedDate}
                            onChange={(e) => setSelectedDate(e.target.value)}
                            className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>

                    <div className="w-full md:w-auto">
                        <h3 className="text-sm font-medium text-slate-400 mb-2">Add Participants</h3>
                        <div className="flex gap-2 flex-wrap">
                            {POPULAR_TIMEZONES.filter(z => !zones.includes(z)).map(z => (
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

                <div className="overflow-x-auto pb-4">
                    <div className="min-w-[800px] glass-card rounded-2xl p-6 border border-white/10">
                        {/* Header Row */}
                        <div className="flex mb-4">
                            <div className="w-48 flex-shrink-0 p-2 font-medium text-slate-400">Location</div>
                            <div className="flex-1 grid grid-cols-24 gap-1">
                                {hours.map(h => (
                                    <div key={h} className="text-center text-xs text-slate-500">
                                        {h}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Zone Rows */}
                        <div className="space-y-4">
                            {zones.map(zone => {
                                // Calculate start of day in UTC roughly
                                // Base logic:
                                // For a given UTC "hour slot", what time is it in Zone?
                                // Let's iterate 0..23 UTC hours from start of selected Date
                                // But wait, user wants to see "Is 9am EST good for everyone?"
                                // usually planners show a unified timeline.

                                // Better approach:
                                // Columns represent "Hour 0" to "Hour 23" relative to the FIRST zone (or UTC) or just absolute hours?
                                // Let's use UTC 0-23 columns for simplicity, or make it scrollable.
                                // OR: Make the columns "Your Local Time"?

                                // Let's align columns to the Viewer's Local Time (or first zone in list).
                                // Let's assume columns are 0-23 of the Selected Date in the FIRST zone in the list.
                                const refZone = zones[0];

                                return (
                                    <div key={zone} className="flex items-center group">
                                        <div className="w-48 flex-shrink-0 p-2">
                                            <div className="font-medium text-white">{getCityName(zone)}</div>
                                            <div className="text-xs text-slate-400 truncate">{zone}</div>
                                            <button onClick={() => removeZone(zone)} className="text-xs text-red-400 opacity-0 group-hover:opacity-100 mt-1 hover:underline">Remove</button>
                                        </div>
                                        <div className="flex-1 grid grid-cols-24 gap-1">
                                            {hours.map(offset => {
                                                // offset is hour index (0..23) relative to start of day in refZone?
                                                // Let's act as if the columns are 00:00 to 23:00 in the FIRST zone.

                                                // 1. Get timestamp for "SelectedDate + offset hours" in refZone
                                                const refDateStr = `${selectedDate}T${offset.toString().padStart(2, '0')}:00`;
                                                const utcTimestamp = fromZonedTime(refDateStr, refZone);

                                                // 2. Convert to current zone
                                                const localHour = parseInt(formatTz(utcTimestamp, 'H', { timeZone: zone }), 10);
                                                const status = getHourStatus(localHour);

                                                return (
                                                    <div
                                                        key={offset}
                                                        className={`h-12 rounded-sm ${getStatusColor(status)} transition-colors relative group/cell cursor-pointer`}
                                                    >
                                                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover/cell:block z-20 bg-slate-900 text-white text-xs p-2 rounded whitespace-nowrap border border-white/10 shadow-xl">
                                                            {formatTz(utcTimestamp, 'h:mm a', { timeZone: zone })}
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        <div className="mt-6 flex gap-4 text-sm text-slate-400 justify-end">
                            <div className="flex items-center gap-2"><div className="w-3 h-3 bg-emerald-500/80 rounded"></div> Work (9am-5pm)</div>
                            <div className="flex items-center gap-2"><div className="w-3 h-3 bg-amber-500/50 rounded"></div> Awake (7am-10pm)</div>
                            <div className="flex items-center gap-2"><div className="w-3 h-3 bg-slate-800/50 rounded"></div> Sleep</div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
