import React, { useState } from 'react';

function ArrowSVG({ onPartClick, activePart, onClearSelection }) {
  const [hoverPart, setHoverPart] = useState(null);
  const isActive = (p) => activePart === p;
  const shouldGlow = (p) => isActive(p) || hoverPart === p;
  const glowFilter = (p) => (shouldGlow(p) ? 'url(#green-glow)' : 'none');

  return (
    <div className="relative mb-10">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1014.27 116.47"
        className="w-[950px] h-auto"
        onClick={() => onClearSelection?.()}
      >
        {/* Reliable green glow */}
        <defs>
          <filter
            id="green-glow"
            x="-40%" y="-40%" width="180%" height="180%"
            colorInterpolationFilters="sRGB"
          >
            <feGaussianBlur in="SourceAlpha" stdDeviation="4" result="blur" />
            <feFlood floodColor="#22c55e" floodOpacity="0.65" />
            <feComposite in2="blur" operator="in" result="glow" />
            <feMerge>
              <feMergeNode in="glow" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Click-away background inside the SVG */}
        <rect x="0" y="0" width="1014.27" height="116.47" fill="transparent" />

        {/* Shaft */}
        <rect
          className={`${isActive('shaft') ? 'fill-green-300' : 'fill-gray-300'} cursor-pointer transition-all duration-200 hover:fill-green-300 hover:-translate-y-1`}
          x="57.79" y="46.25" width="658.04" height="22.21"
          filter={glowFilter('shaft')}
          onMouseOver={() => setHoverPart('shaft')}
          onMouseOut={() => setHoverPart(null)}
          onClick={(e) => { e.stopPropagation(); onPartClick('shaft'); }}
        />

        {/* Fletching (group-level glow on hover/active) */}
        <g
          pointerEvents="bounding-box"
          className="cursor-pointer transition-transform hover:-translate-y-1"
          style={{ transformBox: 'fill-box', transformOrigin: 'center' }}
          filter={glowFilter('fletching')}
          onMouseOver={() => setHoverPart('fletching')}
          onMouseOut={() => setHoverPart(null)}
          onClick={(e) => { e.stopPropagation(); onPartClick('fletching'); }}
        >
          <path className={`transition-all duration-200 ${shouldGlow('fletching') ? 'fill-green-300' : 'fill-gray-300'}`} d="M124.22,35.69s15.86-29.46,40.79-27.65c0,0,139.92,8.39,167.19,27.65H124.22Z"/>
          <path className={`transition-all duration-200 ${shouldGlow('fletching') ? 'fill-green-300' : 'fill-gray-300'}`} d="M124.22,79.03s15.86,30.31,40.79,28.45c0,0,139.92-8.63,167.19-28.45H124.22Z"/>
        </g>


        {/* Knock */}
        <path
          className={`${isActive('knock') ? 'fill-green-300' : 'fill-gray-300'} cursor-pointer transition-all duration-200 hover:fill-green-300 hover:-translate-y-1`}
          filter={glowFilter('knock')}
          d="M48.39,46.51v20.45s-17.82,3.57-38.65-4.56c0,0-.99-2.53,3.57-3.74,0,0,16.06,3.41,12.76-4.45,0,0-.38-2.91-9.62-1.32,0,0-6.23-.27-6.8-3.13,0,0,15.76-7.31,38.75-3.24Z"
          onMouseOver={() => setHoverPart('knock')}
          onMouseOut={() => setHoverPart(null)}
          onClick={(e) => { e.stopPropagation(); onPartClick('knock'); }}
        />

      {/* Tip (group-level glow + translate) */}
        <g
          pointerEvents="bounding-box"
          className="cursor-pointer transition-transform hover:-translate-y-1"
          style={{ transformBox: 'fill-box', transformOrigin: 'center' }}
          filter={glowFilter('tip')}
          onMouseOver={() => setHoverPart('tip')}
          onMouseOut={() => setHoverPart(null)}
          onClick={(e) => { e.stopPropagation(); onPartClick('tip'); }}
        >
          <path
            className={`transition-all duration-200 ${shouldGlow('tip') ? 'fill-green-300' : 'fill-gray-300'}`}
            d="M893.88,24.3s-4.19,5.33-21.84,22.51c-.37-.25-.81-.4-1.3-.4h-18.23c-1.26,0-2.29,1.02-2.29,2.29v18.23c0,1.26,1.02,2.29,2.29,2.29h18.23c.71,0,1.34-.33,1.76-.84,17.25,16.81,21.37,22.04,21.37,22.04l80.31-26.77h20.14v-12.54h-20.14l-80.31-26.79ZM900.67,76.92l-7.87-11.15h45.79l-37.93,11.15ZM892.81,48.96l7.87-11.16,37.93,11.16h-45.79Z"
          />
          <polygon
            className={`transition-all duration-200 ${shouldGlow('tip') ? 'fill-green-300' : 'fill-gray-300'}`}
            points="994.33 51.1 994.33 63.64 1007.72 57.37 994.33 51.1"
          />
        </g>

        {/* Insert */}
        <rect
          className={`${isActive('insert') ? 'fill-green-300' : 'fill-gray-300'} cursor-pointer transition-all duration-200 hover:fill-green-300 hover:-translate-y-1`}
          filter={glowFilter('insert')}
          x="731.34" y="46.95" width="101.3" height="22.21"
          onMouseOver={() => setHoverPart('insert')}
          onMouseOut={() => setHoverPart(null)}
          onClick={(e) => { e.stopPropagation(); onPartClick('insert'); }}
        />
      </svg>
    </div>
  );
}

export default ArrowSVG;
