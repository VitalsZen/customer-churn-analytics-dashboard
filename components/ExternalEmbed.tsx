import React, { useEffect } from 'react';

// Component nhúng biểu đồ Flourish từ nguồn bên ngoài
export const ExternalEmbed: React.FC = () => {
  useEffect(() => {
    // Nạp động script embed của Flourish khi component được mount
    const script = document.createElement('script');
    script.src = 'https://public.flourish.studio/resources/embed.js';
    script.async = true;
    document.body.appendChild(script);

    // Gỡ script khi component bị unmount
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <div className="h-full w-full flex flex-col">
      <div className="mb-4 border-b border-gray-200 pb-2">
        <h3 className="text-xl font-bold uppercase tracking-wider">
          Reference Demo: Bar Chart Race
        </h3>
        <p className="text-sm text-gray-500 font-mono mt-1">
          Source: Flourish Studio (External)
        </p>
      </div>
      
      {/* Container hiển thị biểu đồ, đồng bộ giao diện với dashboard chính */}
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
