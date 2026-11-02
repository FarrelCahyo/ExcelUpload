import React, { useId } from 'react';

export interface KawaiiFileMascotProps {
  /** Size in pixels (sets width and height). Default is 100. */
  size?: number;
  /** Additional CSS class names */
  className?: string;
  /** Whether to show sparkle stars around the sheet mascot. Default is true. */
  showSparkles?: boolean;
}

export const KawaiiFileMascot: React.FC<KawaiiFileMascotProps> = ({
  size = 100,
  className = '',
  showSparkles = true,
}) => {
  const rawId = useId();
  const id = rawId.replace(/[^a-zA-Z0-9-_]/g, '');

  const paperGradId = `kfm-paper-${id}`;
  const foldGradId = `kfm-fold-${id}`;
  const berryGradId = `kfm-berry-${id}`;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`inline-block select-none overflow-visible ${className}`}
      aria-label="Kawaii File Mascot"
      role="img"
    >
      <defs>
        {/* Paper cream/vanilla gradient */}
        <linearGradient id={paperGradId} x1="28" y1="16" x2="92" y2="104" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FFFDF7" />
          <stop offset="60%" stopColor="#FFF9E6" />
          <stop offset="100%" stopColor="#FFF0C8" />
        </linearGradient>

        {/* Folded flap golden gradient */}
        <linearGradient id={foldGradId} x1="74" y1="16" x2="92" y2="34" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FFE082" />
          <stop offset="100%" stopColor="#FFCA28" />
        </linearGradient>

        {/* Mini Strawberry Stamp Gradient */}
        <linearGradient id={berryGradId} x1="72" y1="83" x2="78" y2="92" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FF5C7A" />
          <stop offset="100%" stopColor="#D63447" />
        </linearGradient>
      </defs>

      {/* Soft Ground Shadow */}
      <ellipse cx="60" cy="110" rx="38" ry="7" fill="#F8BBD0" fillOpacity="0.4" />

      {/* Main Document Body */}
      <g>
        {/* Document Sheet with Folded Corner Notch */}
        <path
          d="M 38 16 L 74 16 L 92 34 L 92 94 C 92 100, 86 104, 80 104 L 40 104 C 34 104, 28 100, 28 94 L 28 26 C 28 20, 34 16, 40 16 Z"
          fill={`url(#${paperGradId})`}
          stroke="#F6D078"
          strokeWidth="2.2"
          strokeLinejoin="round"
        />

        {/* Fold Flap Shadow */}
        <path
          d="M 74 16 L 74 34 L 92 34 Z"
          fill="#000000"
          fillOpacity="0.06"
        />

        {/* Top-Right Corner Fold Flap */}
        <path
          d="M 74 16 L 74 34 L 92 34 Z"
          fill={`url(#${foldGradId})`}
          stroke="#F6D078"
          strokeWidth="2"
          strokeLinejoin="round"
        />
        {/* Flap Crease Highlight */}
        <line x1="75" y1="17" x2="91" y2="33" stroke="#FFFFFF" strokeWidth="1.2" strokeOpacity="0.7" />
      </g>

      {/* Kawaii Face */}
      <g>
        {/* Left Happy Curved Eye (^ ^) */}
        <path
          d="M 44 52 C 47 47, 53 47, 56 52"
          stroke="#5D4037"
          strokeWidth="2.8"
          strokeLinecap="round"
        />
        {/* Right Happy Curved Eye (^ ^) */}
        <path
          d="M 64 52 C 67 47, 73 47, 76 52"
          stroke="#5D4037"
          strokeWidth="2.8"
          strokeLinecap="round"
        />

        {/* Left Rosy Cheek with Blush Lines */}
        <g>
          <ellipse cx="40" cy="58" rx="4.5" ry="3" fill="#FF8DA1" fillOpacity="0.75" />
          <line x1="38" y1="57" x2="40" y2="59" stroke="#FF5C7A" strokeWidth="1" strokeLinecap="round" />
          <line x1="41" y1="57" x2="43" y2="59" stroke="#FF5C7A" strokeWidth="1" strokeLinecap="round" />
        </g>

        {/* Right Rosy Cheek with Blush Lines */}
        <g>
          <ellipse cx="80" cy="58" rx="4.5" ry="3" fill="#FF8DA1" fillOpacity="0.75" />
          <line x1="78" y1="57" x2="80" y2="59" stroke="#FF5C7A" strokeWidth="1" strokeLinecap="round" />
          <line x1="81" y1="57" x2="83" y2="59" stroke="#FF5C7A" strokeWidth="1" strokeLinecap="round" />
        </g>

        {/* Sweet Smiling Mouth */}
        <path
          d="M 56 59 C 57.5 64, 62.5 64, 64 59"
          stroke="#5D4037"
          strokeWidth="2"
          strokeLinecap="round"
          fill="#FF6B8B"
        />
      </g>

      {/* Content Document Lines on Lower Half */}
      <g>
        {/* Line 1 */}
        <line x1="38" y1="73" x2="82" y2="73" stroke="#FFE082" strokeWidth="3.5" strokeLinecap="round" />
        {/* Line 2 */}
        <line x1="38" y1="81" x2="68" y2="81" stroke="#FFE082" strokeWidth="3.5" strokeLinecap="round" />
        {/* Line 3 */}
        <line x1="38" y1="89" x2="60" y2="89" stroke="#FFE082" strokeWidth="3.5" strokeLinecap="round" />

        {/* Mini Strawberry Stamp Accent */}
        <g>
          {/* Strawberry Body */}
          <path
            d="M 76 93 C 71 90, 70 84, 73.5 81.5 C 75 80, 77 80, 78.5 81.5 C 82 84, 81 90, 76 93 Z"
            fill={`url(#${berryGradId})`}
          />
          {/* Calyx Leaves */}
          <path
            d="M 74 81.5 C 72 80, 72 79, 74 78 C 75 79.5, 76.5 80.5, 76 81.5 C 76.5 80.5, 78 79.5, 79 78 C 80 79, 80 80, 78 81.5 Z"
            fill="#52B788"
          />
          {/* Seeds */}
          <circle cx="74.5" cy="85" r="0.5" fill="#FFE082" />
          <circle cx="77.5" cy="85" r="0.5" fill="#FFE082" />
          <circle cx="76" cy="88" r="0.5" fill="#FFE082" />
        </g>
      </g>

      {/* Decorative Kawaii Floating Sparkles */}
      {showSparkles && (
        <g>
          {/* Top-Left Golden Sparkle */}
          <path
            d="M 18 26 Q 18 31, 13 31 Q 18 31, 18 36 Q 18 31, 23 31 Q 18 31, 18 26 Z"
            fill="#FFD166"
          />
          {/* Top-Right Pink Sparkle */}
          <path
            d="M 104 38 Q 104 42, 100 42 Q 104 42, 104 46 Q 104 42, 108 42 Q 104 42, 104 38 Z"
            fill="#FF8DA1"
          />
          {/* Bottom-Right Golden Sparkle */}
          <path
            d="M 100 96 Q 100 100, 96 100 Q 100 100, 100 104 Q 100 100, 104 100 Q 100 100, 100 96 Z"
            fill="#FFD166"
          />
        </g>
      )}
    </svg>
  );
};

export default KawaiiFileMascot;
