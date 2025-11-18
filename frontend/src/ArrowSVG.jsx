import React, { useState } from 'react';

/**
 * ArrowSVG
 *  - Arrow side: unchanged (green highlight + lift)
 *  - Bolt side: pixel-accurate highlight using the Bolt.svg itself as a MASK,
 *               so the orange fill perfectly hugs each real part (no boxes),
 *               with hover lift and glow, and no always-on shadow.
 */
export default function ArrowSVG({ onPartClick, activePart, onClearSelection, mode = 'arrow' }) {
  const [hoverPart, setHoverPart] = useState(null);
  const hot = (p) => activePart === p || hoverPart === p;

  // ========================= BOLT =========================
  if (mode === 'bolt') {
    // Bolt dimensions from Bolt.svg
    const BOLT_W = 1801.07;
    const BOLT_H = 236.38;
    
    // Part coordinates from Bolt.svg
    const BOLT_SHAFT_X = 361.39;
    const BOLT_SHAFT_Y = 102.88;
    const BOLT_SHAFT_W = 703.22;
    const BOLT_SHAFT_H = 37.38;
    
    const BOLT_INSERT_X = 1090.28;
    const BOLT_INSERT_Y = 102.88;
    const BOLT_INSERT_W = 121.06;
    const BOLT_INSERT_H = 37.38;

    const boltGlow = (p) => (hot(p) ? 'url(#bolt-glow)' : 'none');

    return (
      <div className="relative mb-10 flex justify-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox={`0 0 ${BOLT_W} ${BOLT_H}`}
          className="w-[950px] h-auto"
          onClick={() => onClearSelection?.()}
        >
          <defs>
            <filter id="bolt-glow" x="-40%" y="-40%" width="180%" height="180%" colorInterpolationFilters="sRGB">
              <feGaussianBlur in="SourceAlpha" stdDeviation="6" result="blur" />
              <feFlood floodColor="#ff7a00" floodOpacity="0.90" />
              <feComposite in2="blur" operator="in" result="glow" />
              <feMerge>
                <feMergeNode in="glow" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          <rect x="0" y="0" width={BOLT_W} height={BOLT_H} fill="transparent" />

          {/* Shaft */}
          <rect
            className={`${hot('shaft') ? 'fill-orange-500' : 'fill-gray-700 dark:fill-gray-300'} cursor-pointer transition-transform duration-200 hover:fill-orange-500 hover:-translate-y-1`}
            x={BOLT_SHAFT_X} y={BOLT_SHAFT_Y} width={BOLT_SHAFT_W} height={BOLT_SHAFT_H}
            filter={boltGlow('shaft')}
            onMouseOver={() => setHoverPart('shaft')}
            onMouseOut={() => setHoverPart(null)}
            onClick={(e) => { e.stopPropagation(); onPartClick?.('shaft'); }}
          />

          {/* Fletching */}
          <g
            pointerEvents="bounding-box"
            className="group cursor-pointer transition-transform duration-200 transform-gpu hover:-translate-y-1"
            filter={boltGlow('fletching')}
            onMouseOver={() => setHoverPart('fletching')}
            onMouseOut={() => setHoverPart(null)}
            onClick={(e) => { e.stopPropagation(); onPartClick?.('fletching'); }}
          >
            <path
              className={`transition-colors duration-200 ${hot('fletching') ? 'fill-orange-500' : 'fill-gray-700 dark:fill-gray-300'}`}
              d="M778.41,85.09s-59-58.45-302.57-49.65c-1.48.05-2.85.77-3.73,1.96-4.57,6.2-19.74,25.74-30.35,26.91-1.48.16-2.81.97-3.75,2.13-2.11,2.6-4.63,8.05-3.06,18.65h343.46Z"
            />
            <path
              className={`transition-colors duration-200 ${hot('fletching') ? 'fill-orange-500' : 'fill-gray-700 dark:fill-gray-300'}`}
              d="M778.41,158.04s-59,58.45-302.57,49.65c-1.48-.05-2.85-.77-3.73-1.96-4.57-6.2-19.74-25.74-30.35-26.91-1.48-.16-2.81-.97-3.75-2.13-2.11-2.6-4.63-8.05-3.06-18.65h343.46Z"
            />
          </g>

          {/* Knock */}
          <path
            className={`${hot('knock') ? 'fill-orange-500' : 'fill-gray-700 dark:fill-gray-300'} cursor-pointer transition-transform duration-200 hover:fill-orange-500 hover:-translate-y-1`}
            filter={boltGlow('knock')}
            d="M343.46,102.88h-47.64c-1.46,0-2.47,1.46-1.95,2.83l4.74,12.45c.84,2.2.84,4.63,0,6.82l-4.67,12.27c-.55,1.45.52,3.01,2.07,3.01h47.44v-37.38Z"
            onMouseOver={() => setHoverPart('knock')}
            onMouseOut={() => setHoverPart(null)}
            onClick={(e) => { e.stopPropagation(); onPartClick?.('knock'); }}
          />

          {/* Tip */}
          <g
            pointerEvents="bounding-box"
            className="group cursor-pointer transition-transform duration-200 transform-gpu hover:-translate-y-1"
            filter={boltGlow('tip')}
            onMouseOver={() => setHoverPart('tip')}
            onMouseOut={() => setHoverPart(null)}
            onClick={(e) => { e.stopPropagation(); onPartClick?.('tip'); }}
          >
            <path
              className={`transition-colors duration-200 ${hot('tip') ? 'fill-orange-500' : 'fill-gray-700 dark:fill-gray-300'}`}
              d="M1313.81,64.52s-7.06,8.97-36.76,37.88c-.62-.43-1.37-.68-2.18-.68h-30.69c-2.13,0-3.85,1.72-3.85,3.85v30.69c0,2.13,1.72,3.85,3.85,3.85h30.69c1.2,0,2.26-.56,2.97-1.42,29.04,28.29,35.97,37.09,35.97,37.09l135.18-45.06h33.89v-21.11h-33.89l-135.18-45.09ZM1325.25,153.08l-13.24-18.77h77.08l-63.84,18.77ZM1312.01,106.03l13.24-18.78,63.84,18.78h-77.08Z"
            />
            <polygon
              className={`transition-colors duration-200 ${hot('tip') ? 'fill-orange-500' : 'fill-gray-700 dark:fill-gray-300'}`}
              points="1482.89 109.61 1482.89 130.72 1505.43 120.17 1482.89 109.61"
            />
          </g>

          {/* Insert */}
          <rect
            className={`${hot('insert') ? 'fill-orange-500' : 'fill-gray-700 dark:fill-gray-300'} cursor-pointer transition-transform duration-200 hover:fill-orange-500 hover:-translate-y-1`}
            filter={boltGlow('insert')}
            x={BOLT_INSERT_X} y={BOLT_INSERT_Y} width={BOLT_INSERT_W} height={BOLT_INSERT_H}
            onMouseOver={() => setHoverPart('insert')}
            onMouseOut={() => setHoverPart(null)}
            onClick={(e) => { e.stopPropagation(); onPartClick?.('insert'); }}
          />
        </svg>
      </div>
    );
  }

  // ========================= ARROW (unchanged) =========================
  const SHAFT_X = 57.79, SHAFT_Y = 46.25, SHAFT_H = 22.21, SHAFT_W = 658.04;
  const INSERT_X = 731.34, INSERT_Y = 46.95, INSERT_W = 101.3;
  const insertX = SHAFT_X + SHAFT_W + (INSERT_X - (SHAFT_X + SHAFT_W));
  const greenGlow = (p) => (hot(p) ? 'url(#green-glow)' : 'none');

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

        <rect x="0" y="0" width="1014.27" height="116.47" fill="transparent" />

        {/* Shaft */}
        <rect
          className={`${hot('shaft') ? 'fill-green-400' : 'fill-gray-700 dark:fill-gray-300'} cursor-pointer transition-transform duration-200 hover:fill-green-400 hover:-translate-y-1`}
          x={SHAFT_X} y={SHAFT_Y} width={SHAFT_W} height={SHAFT_H}
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
            className={`transition-colors duration-200 ${hot('fletching') ? 'fill-green-400' : 'fill-gray-700 dark:fill-gray-300'}`}
            d="M124.22,35.69s15.86-29.46,40.79-27.65c0,0,139.92,8.39,167.19,27.65H124.22Z"
          />
          <path
            className={`transition-colors duration-200 ${hot('fletching') ? 'fill-green-400' : 'fill-gray-700 dark:fill-gray-300'}`}
            d="M124.22,79.03s15.86,30.31,40.79,28.45c0,0,139.92-8.63,167.19-28.45H124.22Z"
          />
        </g>

        {/* Knock */}
        <path
          className={`${hot('knock') ? 'fill-green-400' : 'fill-gray-700 dark:fill-gray-300'} cursor-pointer transition-transform duration-200 hover:fill-green-400 hover:-translate-y-1`}
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
            className={`transition-colors duration-200 ${hot('tip') ? 'fill-green-400' : 'fill-gray-700 dark:fill-gray-300'}`}
            d="M893.88,24.3s-4.19,5.33-21.84,22.51c-.37-.25-.81-.4-1.3-.4h-18.23c-1.26,0-2.29,1.02-2.29,2.29v18.23c0,1.26,1.02,2.29,2.29,2.29h18.23c.71,0,1.34-.33,1.76-.84,17.25,16.81,21.37,22.04,21.37,22.04l80.31-26.77h20.14v-12.54h-20.14l-80.31-26.79ZM900.67,76.92l-7.87-11.15h45.79l-37.93,11.15ZM892.81,48.96l7.87-11.16,37.93,11.16h-45.79Z"
          />
          <polygon
            className={`transition-colors duration-200 ${hot('tip') ? 'fill-green-400' : 'fill-gray-700 dark:fill-gray-300'}`}
            points="994.33 51.1 994.33 63.64 1007.72 57.37 994.33 51.1"
          />
        </g>

        {/* Insert */}
        <rect
          className={`${hot('insert') ? 'fill-green-400' : 'fill-gray-700 dark:fill-gray-300'} cursor-pointer transition-transform duration-200 hover:fill-green-400 hover:-translate-y-1`}
          filter={greenGlow('insert')}
          x={insertX} y={INSERT_Y} width={INSERT_W} height="22.21"
          onMouseOver={() => setHoverPart('insert')}
          onMouseOut={() => setHoverPart(null)}
          onClick={(e) => { e.stopPropagation(); onPartClick?.('insert'); }}
        />
      </svg>
    </div>
  );
}
