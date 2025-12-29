import { format, toZonedTime } from 'date-fns-tz';
import { enUS } from 'date-fns/locale';

// Common time zones to start with
export const POPULAR_TIMEZONES = [
    'UTC',
    'America/New_York',
    'America/Los_Angeles',
    'Europe/London',
    'Europe/Paris',
    'Asia/Tokyo',
    'Asia/Dubai',
    'Australia/Sydney',
];

export interface TimeZoneInfo {
    name: string;
    city: string;
    offset: string;
    currentTime: string;
}

export const getFormattedTime = (zone: string, dateFormat = 'HH:mm'): string => {
    try {
        const now = new Date();
        // Get the zoned time
        // const zonedDate = toZonedTime(now, zone);
        return format(now, dateFormat, { timeZone: zone, locale: enUS });
    } catch (error) {
        console.error(`Error formatting time for zone ${zone}:`, error);
        return '--:--';
    }
};

export const getCityName = (zone: string): string => {
    const parts = zone.split('/');
    return parts[parts.length - 1].replace('_', ' ');
};

export const getAllTimeZones = (): string[] => {
    // In a real app we might pull this from Intl.supportedValuesOf('timeZone')
    // For now return a curated list + any passed in
    try {
        if (typeof Intl !== 'undefined' && 'supportedValuesOf' in Intl) {
            // @ts-ignore
            return Intl.supportedValuesOf('timeZone');
        }
    } catch (e) {
        console.warn("Intl.supportedValuesOf not supported");
    }
    return POPULAR_TIMEZONES;
};
