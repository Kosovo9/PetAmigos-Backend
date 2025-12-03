import { useState, useEffect } from 'react';

interface Location {
    latitude: number;
    longitude: number;
    countryCode?: string;
    city?: string;
    error?: string;
}

export const useGeolocation = () => {
    const [location, setLocation] = useState<Location | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!navigator.geolocation) {
            setLocation({ latitude: 0, longitude: 0, error: 'Geolocation not supported' });
            setLoading(false);
            return;
        }

        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const { latitude, longitude } = position.coords;

                // Optional: Reverse Geocoding (Mock for now to save API calls)
                // In production, call your backend or Google Maps API here

                setLocation({
                    latitude,
                    longitude,
                    countryCode: 'US', // Mock
                    city: 'San Francisco' // Mock
                });
                setLoading(false);
            },
            (error) => {
                setLocation({ latitude: 0, longitude: 0, error: error.message });
                setLoading(false);
            }
        );
    }, []);

    return { location, loading };
};
