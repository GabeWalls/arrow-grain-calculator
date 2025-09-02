import React, { useState } from 'react';

/**
 * ArrowSVG
 * Props:
 *  - mode: 'arrow' | 'bolt'
 *  - onPartClick(part)
 *  - activePart
 *  - onClearSelection?()
 */
function ArrowSVG({ onPartClick, activePart, onClearSelection, mode = 'arrow' }) {
  const [hoverPart, setHoverPart] = useState(null);
  const isActive = (p) => activePart === p;
  const shouldGlow = (p) => isActive(p) || hoverPart === p;
  const glowFilter = (p) => (shouldGlow(p) ? 'url(#green-glow)' : 'none');

  // ---- Base geometry from original SVG ----
  const SHAFT_X = 57.79;
  const SHAFT_Y = 46.25;
  const SHAFT_H = 22.21;
  const SHAFT_W_ORIG = 658.04;

  const INSERT_X_ORIG = 731.34;
  const INSERT_Y = 46.95;
  const INSERT_W = 101.3;

  const TIP_ORIG_X = 893.88;

  // Original gaps (measured)
  const SHAFT_END_ORIG = SHAFT_X + SHAFT_W_ORIG;                 // 715.83
  const GAP_SHAFT_TO_INSERT = INSERT_X_ORIG - SHAFT_END_ORIG;     // ≈15.51
  const INSERT_RIGHT_ORIG = INSERT_X_ORIG + INSERT_W;             // 832.64
  const GAP_INSERT_TO_TIP = TIP_ORIG_X - INSERT_RIGHT_ORIG;       // ≈61.24

  // ---- Bolt adjustments ----
  const SHAFT_W_BOLT = 420; // shorter shaft for bolt
  const shaftW = mode === 'bolt' ? SHAFT_W_BOLT : SHAFT_W_ORIG;

  // keep silhouette centered when shortening
  const delta = SHAFT_W_ORIG - shaftW;
  const globalTranslate = mode === 'bolt' ? `translate(${delta / 2}, 0)` : 'translate(0, 0)';

  // insert tracks the current shaft end using the same original gap
  const shaftEndNow = SHAFT_X + shaftW;
  const insertX = shaftEndNow + GAP_SHAFT_TO_INSERT;

  // tip tracks the insert's right edge using the same original gap
  const insertRightNow = insertX + INSERT_W;
  const tipTargetLeft = insertRightNow + GAP_INSERT_TO_TIP;
  const tipTranslateX = tipTargetLeft - TIP_ORIG_X;

  // small vertical nudge so tip sits on the shaft line in bolt mode
  const TIP_Y_OFFSET_BOLT = 4;
  const tipTranslate = mode === 'bolt'
    ? `translate(${tipTranslateX}, ${TIP_Y_OFFSET_BOLT})`
    : 'translate(0, 0)';

  // Shorter fletchings for bolts (scale X around base pivot)
  const FLETCH_PIVOT_X = 124.22;
  const FLETCH_SCALE_X_BOLT = 0.75;
  const fletchTransform =
    mode === 'bolt'
      ? `translate(${FLETCH_PIVOT_X}, 0) scale(${FLETCH_SCALE_X_BOLT}, 1) translate(${-FLETCH_PIVOT_X}, 0)`
      : 'translate(0, 0)';

  return (
    <div className="relative mb-10">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1014.27 116.47"
        className="w-[950px] h-auto"
        onClick={() => onClearSelection?.()}
      >
        <defs>
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

        {/* Wrap everything to keep centered in bolt mode */}
        <g transform={globalTranslate}>
          {/* Shaft */}
          <rect
            className={`${isActive('shaft') ? 'fill-green-400' : 'fill-gray-300'} cursor-pointer transition-transform duration-200 hover:fill-green-400 hover:-translate-y-1`}
            x={SHAFT_X}
            y={SHAFT_Y}
            width={shaftW}
            height={SHAFT_H}
            filter={glowFilter('shaft')}
            onMouseOver={() => setHoverPart('shaft')}
            onMouseOut={() => setHoverPart(null)}
            onClick={(e) => { e.stopPropagation(); onPartClick('shaft'); }}
          />

          {/* Fletching — shortened in bolt mode */}
          <g
            pointerEvents="bounding-box"
            transform={fletchTransform}
            className="group cursor-pointer transition-transform duration-200 transform-gpu hover:-translate-y-1"
            filter={glowFilter('fletching')}
            onMouseOver={() => setHoverPart('fletching')}
            onMouseOut={() => setHoverPart(null)}
            onClick={(e) => { e.stopPropagation(); onPartClick('fletching'); }}
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
            filter={glowFilter('knock')}
            d="M48.39,46.51v20.45s-17.82,3.57-38.65-4.56c0,0-.99-2.53,3.57-3.74,0,0,16.06,3.41,12.76-4.45,0,0-.38-2.91-9.62-1.32,0,0-6.23-.27-6.8-3.13,0,0,15.76-7.31,38.75-3.24Z"
            onMouseOver={() => setHoverPart('knock')}
            onMouseOut={() => setHoverPart(null)}
            onClick={(e) => { e.stopPropagation(); onPartClick('knock'); }}
          />

          {/* Tip — tracks insert + slight drop in bolt mode */}
          <g
            pointerEvents="bounding-box"
            className="group cursor-pointer transition-transform duration-200 transform-gpu hover:-translate-y-1"
            filter={glowFilter('tip')}
            transform={tipTranslate}
            onMouseOver={() => setHoverPart('tip')}
            onMouseOut={() => setHoverPart(null)}
            onClick={(e) => { e.stopPropagation(); onPartClick('tip'); }}
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

          {/* Insert — recomputed to meet the shortened shaft */}
          <rect
            className={`${isActive('insert') ? 'fill-green-400' : 'fill-gray-300'} cursor-pointer transition-transform duration-200 hover:fill-green-400 hover:-translate-y-1`}
            filter={glowFilter('insert')}
            x={insertX}
            y={INSERT_Y}
            width={INSERT_W}
            height="22.21"
            onMouseOver={() => setHoverPart('insert')}
            onMouseOut={() => setHoverPart(null)}
            onClick={(e) => { e.stopPropagation(); onPartClick('insert'); }}
          />
        </g>
      </svg>
    </div>
  );
}

export default ArrowSVG;
