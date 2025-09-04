import React, { useState } from 'react';

/**
 * ArrowSVG (drop-in)
 * Props:
 *  - mode: 'arrow' | 'bolt'
 *  - onPartClick(part)
 *  - activePart
 *  - onClearSelection?()
 *
 * Fixes:
 *  - Hooks are declared once at the top (no conditional Hook calls).
 *  - Bolt now has interactive hot-zones (knock, fletching, shaft, insert, tip) with ORANGE glow.
 *  - Arrow keeps your original interactive behavior with GREEN glow.
 */
function ArrowSVG({ onPartClick, activePart, onClearSelection, mode = 'arrow' }) {
  // Hooks MUST be unconditional
  const [hoverPart, setHoverPart] = useState(null);
  const isActive = (p) => activePart === p;
  const shouldGlow = (p) => isActive(p) || hoverPart === p;

  // ===================== BOLT MODE (interactive overlays) =====================
  if (mode === 'bolt') {
    const W = 1014.27;
    const H = 116.47;

    // Overlay rectangles roughly aligned to your Bolt.svg
    const zones = {
      shaft:     { x: 260, y: 46,  w: 520, h: 22 },
      insert:    { x: 800, y: 46,  w:  95, h: 22 },
      tip:       { x: 905, y: 28,  w:  95, h: 60 },
      fletching: { x: 190, y: 18,  w: 180, h: 80 },
      knock:     { x: 120, y: 46,  w:  40, h: 22 },
    };

    const fillOrange = (p) => (shouldGlow(p) ? '#fb923c' : 'rgba(0,0,0,0)');
    const strokeOrange = (p) => (shouldGlow(p) ? '#fb923c' : 'transparent');

    return (
      <div className="relative mb-10 flex justify-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox={`0 0 ${W} ${H}`}
          className="w-[950px] h-auto"
          onClick={() => onClearSelection?.()}
        >
          <defs>
            {/* Orange glow for bolt */}
            <filter id="orange-glow" x="-40%" y="-40%" width="180%" height="180%" colorInterpolationFilters="sRGB">
              <feGaussianBlur in="SourceAlpha" stdDeviation="6" result="blur" />
              <feFlood floodColor="#fb923c" floodOpacity="0.70" />
              <feComposite in2="blur" operator="in" result="glow" />
              <feMerge>
                <feMergeNode in="glow" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Base bolt art */}
          <image
            href={process.env.PUBLIC_URL + '/Bolt.svg'}
            x="0"
            y="0"
            width={W}
            height={H}
            preserveAspectRatio="xMidYMid meet"
            style={{
              filter:
                'drop-shadow(0 0 8px rgba(249,115,22,0.65)) drop-shadow(0 0 16px rgba(249,115,22,0.45))',
            }}
          />

          {/* Interactive highlight overlays + invisible hit areas */}
          {Object.entries(zones).map(([name, z]) => (
            <g key={name} pointerEvents="all">
              {/* visible highlight */}
              <rect
                x={z.x}
                y={z.y}
                width={z.w}
                height={z.h}
                rx={3}
                ry={3}
                fill={fillOrange(name)}
                stroke={strokeOrange(name)}
                strokeWidth={shouldGlow(name) ? 2 : 0}
                filter={shouldGlow(name) ? 'url(#orange-glow)' : 'none'}
                className="transition-all duration-150"
              />
              {/* invisible, bigger hitbox for easy hover/click */}
              <rect
                x={z.x - 6}
                y={z.y - 10}
                width={z.w + 12}
                height={z.h + 20}
                fill="rgba(255,255,255,0.0001)"
                onMouseOver={() => setHoverPart(name)}
                onMouseOut={() => setHoverPart(null)}
                onClick={(e) => { e.stopPropagation(); onPartClick?.(name); }}
                className="cursor-pointer"
              />
            </g>
          ))}
        </svg>
      </div>
    );
  }

  // ===================== ARROW MODE (original interactive) =====================
  const SHAFT_X = 57.79;
  const SHAFT_Y = 46.25;
  const SHAFT_H = 22.21;
  const SHAFT_W = 658.04;

  const INSERT_X = 731.34;
  const INSERT_Y = 46.95;
  const INSERT_W = 101.3;

  const TIP_X = 893.88;

  // Measured gaps (kept for layout parity)
  const SHAFT_END = SHAFT_X + SHAFT_W;             // 715.83
  const GAP_SHAFT_TO_INSERT = INSERT_X - SHAFT_END; // ≈15.51
  const INSERT_RIGHT = INSERT_X + INSERT_W;         // 832.64
  // const GAP_INSERT_TO_TIP = TIP_X - INSERT_RIGHT; // ≈61.24 (not used directly)

  const insertX = SHAFT_X + SHAFT_W + GAP_SHAFT_TO_INSERT;

  const greenGlow = (p) => (shouldGlow(p) ? 'url(#green-glow)' : 'none');

  return (
    <div className="relative mb-10">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1014.27 116.47"
        className="w-[950px] h-auto"
        onClick={() => onClearSelection?.()}
      >
        <defs>
          {/* green highlight/glow for arrow */}
          <filter id="green-glow" x="-40%" y="-40%" width="180%" height="180%" colorInterpolationFilters="sRGB">
            <feGaussianBlur in="SourceAlpha" stdDeviation="6" result="blur" />
            <feFlood floodColor="#39ff14" floodOpacity="0.65" />
            <feComposite in2="blur" operator="in" result="glow" />
            <feMerge>
              <feMergeNode in="glow" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* click-away backdrop */}
        <rect x="0" y="0" width="1014.27" height="116.47" fill="transparent" />

        {/* Shaft */}
        <rect
          className={`${isActive('shaft') ? 'fill-green-400' : 'fill-gray-300'} cursor-pointer transition-transform duration-200 hover:fill-green-400 hover:-translate-y-1`}
          x={SHAFT_X}
          y={SHAFT_Y}
          width={SHAFT_W}
          height={SHAFT_H}
          filter={greenGlow('shaft')}
          onMouseOver={() => setHoverPart('shaft')}
          onMouseOut={() => setHoverPart(null)}
          onClick={(e) => { e.stopPropagation(); onPartClick?.('shaft'); }}
        />

        {/* Fletching */}
        <g
          pointerEvents="bounding-box"
          className="group cursor-pointer transition-transform duration-200 transform-gpu hover:-translate-y-1"
          filter={greenGlow('fletching')}
          onMouseOver={() => setHoverPart('fletching')}
          onMouseOut={() => setHoverPart(null)}
          onClick={(e) => { e.stopPropagation(); onPartClick?.('fletching'); }}
        >
          <path
            className={`transition-colors duration-200 ${shouldGlow('fletching') ? 'fill-green-400' : 'fill-gray-300'}`}
            d="M124.22,35.69s15.86-29.46,40.79-27.65c0,0,139.92,8.39,167.19,27.65H124.22Z"
          />
          <path
            className={`transition-colors duration-200 ${shouldGlow('fletching') ? 'fill-green-400' : 'fill-gray-300'}`}
            d="M124.22,79.03s15.86,30.31,40.79,28.45c0,0,139.92-8.63,167.19-28.45H124.22Z"
          />
        </g>

        {/* Knock */}
        <path
          className={`${isActive('knock') ? 'fill-green-400' : 'fill-gray-300'} cursor-pointer transition-transform duration-200 hover:fill-green-400 hover:-translate-y-1`}
          filter={greenGlow('knock')}
          d="M48.39,46.51v20.45s-17.82,3.57-38.65-4.56c0,0-.99-2.53,3.57-3.74,0,0,16.06,3.41,12.76-4.45,0,0-.38-2.91-9.62-1.32,0,0-6.23-.27-6.8-3.13,0,0,15.76-7.31,38.75-3.24Z"
          onMouseOver={() => setHoverPart('knock')}
          onMouseOut={() => setHoverPart(null)}
          onClick={(e) => { e.stopPropagation(); onPartClick?.('knock'); }}
        />

        {/* Tip */}
        <g
          pointerEvents="bounding-box"
          className="group cursor-pointer transition-transform duration-200 transform-gpu hover:-translate-y-1"
          filter={greenGlow('tip')}
          onMouseOver={() => setHoverPart('tip')}
          onMouseOut={() => setHoverPart(null)}
          onClick={(e) => { e.stopPropagation(); onPartClick?.('tip'); }}
        >
          <path
            className={`transition-colors duration-200 ${shouldGlow('tip') ? 'fill-green-400' : 'fill-gray-300'}`}
            d="M893.88,24.3s-4.19,5.33-21.84,22.51c-.37-.25-.81-.4-1.3-.4h-18.23c-1.26,0-2.29,1.02-2.29,2.29v18.23c0,1.26,1.02,2.29,2.29,2.29h18.23c.71,0,1.34-.33,1.76-.84,17.25,16.81,21.37,22.04,21.37,22.04l80.31-26.77h20.14v-12.54h-20.14l-80.31-26.79ZM900.67,76.92l-7.87-11.15h45.79l-37.93,11.15ZM892.81,48.96l7.87-11.16,37.93,11.16h-45.79Z"
          />
          <polygon
            className={`transition-colors duration-200 ${shouldGlow('tip') ? 'fill-green-400' : 'fill-gray-300'}`}
            points="994.33 51.1 994.33 63.64 1007.72 57.37 994.33 51.1"
          />
        </g>

        {/* Insert */}
        <rect
          className={`${isActive('insert') ? 'fill-green-400' : 'fill-gray-300'} cursor-pointer transition-transform duration-200 hover:fill-green-400 hover:-translate-y-1`}
          filter={greenGlow('insert')}
          x={insertX}
          y={INSERT_Y}
          width={INSERT_W}
          height="22.21"
          onMouseOver={() => setHoverPart('insert')}
          onMouseOut={() => setHoverPart(null)}
          onClick={(e) => { e.stopPropagation(); onPartClick?.('insert'); }}
        />
      </svg>
    </div>
  );
}

export default ArrowSVG;
