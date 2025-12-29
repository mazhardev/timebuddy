import { useState, useEffect } from 'react';

export const useWorldClock = (intervalMs = 1000) => {
    const [now, setNow] = useState<Date | null>(null);

    useEffect(() => {
        setNow(new Date()); // Initial set to avoid hydration mismatch by ensuring it runs on client

        const timer = setInterval(() => {
            setNow(new Date());
        }, intervalMs);

        return () => clearInterval(timer);
    }, [intervalMs]);

    return now;
};
