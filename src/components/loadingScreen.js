import React, { useState, useEffect } from 'react';
import * as Progress from '@radix-ui/react-progress';

const LoadingScreen = ({ onLoadingComplete, duration = 5000 }) => {
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const interval = Math.max(20, duration / 100);
        const timer = setInterval(() => {
            setProgress(prevProgress => {
                const nextProgress = Math.min(prevProgress + Math.max(1, (100 - prevProgress) / 5), 100);
                
                if (nextProgress >= 100) {
                    clearInterval(timer);
                    // Memastikan callback dipanggil setelah progress mencapai 100%
                    setTimeout(() => {
                        onLoadingComplete?.();
                    }, 200); // Memberikan sedikit delay untuk efek visual
                }
                
                return nextProgress;
            });
        }, 100);

        return () => clearInterval(timer);
    }, [onLoadingComplete, duration]);

    return (
        <div className="fixed inset-0 flex flex-col items-center justify-center bg-white">
            <div className="w-64 space-y-4">
                <div className="text-center text-lg font-medium text-gray-700">
                    Memuat data...
                </div>

                <Progress.Root
                    className="relative h-4 w-full overflow-hidden rounded-full bg-gray-200"
                    value={progress}
                >
                    <Progress.Indicator
                        className="h-full w-full bg-blue-500 transition-transform duration-300 ease-in-out"
                        style={{ transform: `translateX(-${100 - progress}%)` }}
                    />
                </Progress.Root>

                <div className="text-center text-sm text-gray-500">
                    {Math.round(progress)}%
                </div>
            </div>
        </div>
    );
};

export default LoadingScreen;