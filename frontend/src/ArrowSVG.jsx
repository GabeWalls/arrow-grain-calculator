import React from 'react';

function ArrowSVG({ onPartClick, activePart }) {
  const isActive = (part) => activePart === part;

  return (
    <div className="relative mb-10">
      <svg
        id="Layer_1"
        data-name="Layer 1"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1014.27 116.47"
        className="w-[950px] h-auto"
      >
        {/* Shaft */}
        <rect
          className={`fill-gray-300 cursor-pointer transition-all duration-200 hover:fill-green-300 hover:drop-shadow-[0_0_10px_rgba(34,197,94,0.6)] hover:-translate-y-1 
            ${isActive('shaft') ? 'fill-green-300 drop-shadow-[0_0_10px_rgba(34,197,94,0.6)]' : ''}`}
          x="57.79"
          y="46.25"
          width="658.04"
          height="22.21"
          onClick={() => onPartClick('shaft')}
        />

        {/* Fletching Group */}
        <g
          className={`group cursor-pointer transition-all duration-200 hover:-translate-y-1 
            ${isActive('fletching') ? 'drop-shadow-[0_0_10px_rgba(34,197,94,0.6)]' : ''}`}
          onClick={() => onPartClick('fletching')}
        >
          <path
            className={`fill-gray-300 group-hover:fill-green-300 transition-all 
              ${isActive('fletching') ? 'fill-green-300' : ''}`}
            d="M124.22,35.69s15.86-29.46,40.79-27.65c0,0,139.92,8.39,167.19,27.65H124.22Z"
          />
          <path
            className={`fill-gray-300 group-hover:fill-green-300 transition-all 
              ${isActive('fletching') ? 'fill-green-300' : ''}`}
            d="M124.22,79.03s15.86,30.31,40.79,28.45c0,0,139.92-8.63,167.19-28.45H124.22Z"
          />
        </g>

        {/* Knock */}
        <path
          className={`fill-gray-300 cursor-pointer transition-all duration-200 hover:fill-green-300 hover:drop-shadow-[0_0_10px_rgba(34,197,94,0.6)] hover:-translate-y-1 
            ${isActive('knock') ? 'fill-green-300 drop-shadow-[0_0_10px_rgba(34,197,94,0.6)]' : ''}`}
          d="M48.39,46.51v20.45s-17.82,3.57-38.65-4.56c0,0-.99-2.53,3.57-3.74,0,0,16.06,3.41,12.76-4.45,0,0-.38-2.91-9.62-1.32,0,0-6.23-.27-6.8-3.13,0,0,15.76-7.31,38.75-3.24Z"
          onClick={() => onPartClick('knock')}
        />

        {/* Insert + Tip */}
        <g
          className={`group cursor-pointer transition-all duration-200 hover:-translate-y-1 
            ${isActive('tip') ? 'drop-shadow-[0_0_10px_rgba(34,197,94,0.6)]' : ''}`}
          onClick={() => onPartClick('tip')}
        >
          <path
            className={`fill-gray-300 group-hover:fill-green-300 transition-all 
              ${isActive('tip') ? 'fill-green-300' : ''}`}
            d="M893.88,24.3s-4.19,5.33-21.84,22.51c-.37-.25-.81-.4-1.3-.4h-18.23c-1.26,0-2.29,1.02-2.29,2.29v18.23c0,1.26,1.02,2.29,2.29,2.29h18.23c.71,0,1.34-.33,1.76-.84,17.25,16.81,21.37,22.04,21.37,22.04l80.31-26.77h20.14v-12.54h-20.14l-80.31-26.79ZM900.67,76.92l-7.87-11.15h45.79l-37.93,11.15ZM892.81,48.96l7.87-11.16,37.93,11.16h-45.79Z"
          />
          <polygon
            className={`fill-gray-300 group-hover:fill-green-300 transition-all 
              ${isActive('tip') ? 'fill-green-300' : ''}`}
            points="994.33 51.1 994.33 63.64 1007.72 57.37 994.33 51.1"
          />
        </g>

        {/* Insert shaft segment */}
        <rect
          className={`fill-gray-300 cursor-pointer transition-all duration-200 hover:fill-green-300 hover:drop-shadow-[0_0_10px_rgba(34,197,94,0.6)] hover:-translate-y-1 
            ${isActive('insert') ? 'fill-green-300 drop-shadow-[0_0_10px_rgba(34,197,94,0.6)]' : ''}`}
          x="731.34"
          y="46.95"
          width="101.3"
          height="22.21"
          onClick={() => onPartClick('insert')}
        />
      </svg>
    </div>
  );
}

export default ArrowSVG;
