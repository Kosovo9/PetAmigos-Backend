import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { ChevronUp, ChevronDown } from 'lucide-react';

/**
 * VideoSpeedControl – a compact UI to adjust playback speed of a video.
 * Supports common speeds from 0.25x to 2x. The component calls `onChange`
 * with the selected speed, allowing the parent to set `video.playbackRate`.
 */
export const VideoSpeedControl: React.FC<{ onChange: (speed: number) => void }> = ({ onChange }) => {
    const speeds = [0.25, 0.5, 1, 1.5, 2];
    const [current, setCurrent] = useState(1);

    const handleSelect = (speed: number) => {
        setCurrent(speed);
        onChange(speed);
    };

    return (
        <div className="flex items-center space-x-2 bg-white/90 backdrop-blur-md rounded-full px-3 py-1 shadow-md">
            {speeds.map((s) => (
                <Button
                    key={s}
                    variant={s === current ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => handleSelect(s)}
                    className={`text-xs ${s === current ? 'bg-primary text-white' : ''}`}
                >
                    {s}x
                </Button>
            ))}
        </div>
    );
};
