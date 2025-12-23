import React, { useEffect } from 'react';

export const ExternalEmbed: React.FC = () => {
  useEffect(() => {
    // Dynamically load the Flourish embed script
    const script = document.createElement('script');
    script.src = 'https://public.flourish.studio/resources/embed.js';
    script.async = true;
    document.body.appendChild(script);

    // Cleanup script on unmount
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <div className="h-full w-full flex flex-col">
      <div className="mb-4 border-b border-gray-200 pb-2">
        <h3 className="text-xl font-bold uppercase tracking-wider">Reference Demo: Bar Chart Race</h3>
        <p className="text-sm text-gray-500 font-mono mt-1">Source: Flourish Studio (External)</p>
      </div>
      
      {/* Container matches the boxy aesthetic of the main dashboard */}
      <div className="flex-1 w-full relative border border-slate-200 p-4 bg-white">
        <div 
          className="flourish-embed flourish-bar-chart-race" 
          data-src="visualisation/26463070"
          style={{ width: '100%', height: '100%' }}
        >
          <noscript>
            <img 
              src="https://public.flourish.studio/visualisation/26463070/thumbnail" 
              width="100%" 
              alt="bar-chart-race visualization" 
            />
          </noscript>
        </div>
      </div>
    </div>
  );
};