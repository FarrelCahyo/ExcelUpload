import React, { useId } from 'react';

// ==========================================
// 1. FluffyCloud Component
// ==========================================
export interface FluffyCloudProps {
  /** Size in pixels (scales width proportionally). Default is 80. */
  size?: number;
  /** Color theme variant */
  variant?: 'pink' | 'white' | 'lavender';
  /** Additional CSS class names */
  className?: string;
  /** Whether to show a subtle sleeping/smiling kawaii face. Default is false. */
  withFace?: boolean;
  /** Whether to show tiny floating sparkles around cloud. Default is false. */
  withSparkles?: boolean;
}

export const FluffyCloud: React.FC<FluffyCloudProps> = ({
  size = 80,
  variant = 'pink',
  className = '',
  withFace = false,
  withSparkles = false,
}) => {
  const rawId = useId();
  const id = rawId.replace(/[^a-zA-Z0-9-_]/g, '');

  const gradId = `fc-grad-${id}`;

  const colors = {
    pink: {
      top: '#FFF5F8',
      bottom: '#FFE2E8',
      stroke: '#FFB6C1',
      shadow: '#FF8DA1',
    },
    white: {
      top: '#FFFFFF',
      bottom: '#FFF0F3',
      stroke: '#FCE4EC',
      shadow: '#F8BBD0',
    },
    lavender: {
      top: '#FAF5FF',
      bottom: '#F3E8FF',
      stroke: '#E9D5FF',
      shadow: '#D8B4FE',
    },
  }[variant];

  const height = Math.round(size * 0.6);

  return (
    <svg
      width={size}
      height={height}
      viewBox="0 0 120 72"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`inline-block select-none overflow-visible ${className}`}
      aria-hidden="true"
      role="presentation"
    >
      <defs>
        <linearGradient id={gradId} x1="60" y1="12" x2="60" y2="64" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor={colors.top} />
          <stop offset="100%" stopColor={colors.bottom} />
        </linearGradient>
      </defs>

      {/* Cloud Soft Shadow */}
      <ellipse cx="60" cy="65" rx="46" ry="6" fill={colors.shadow} fillOpacity="0.22" />

      {/* Main Fluffy Puffy Cloud Contour */}
      <path
        d="M 28 58 
           C 18 58, 10 50, 10 40 
           C 10 32, 17 25, 25 25 
           C 27 16, 38 10, 49 13 
           C 56 6, 72 6, 80 14 
           C 88 10, 100 15, 103 25 
           C 111 26, 116 33, 116 41 
           C 116 50, 108 58, 98 58 
           Z"
        fill={`url(#${gradId})`}
        stroke={colors.stroke}
        strokeWidth="2"
        strokeLinejoin="round"
      />

      {/* Cloud Puff Highlights / Inner Depth Arcs */}
      <path
        d="M 22 36 C 24 30, 30 26, 36 28"
        stroke="#FFFFFF"
        strokeWidth="2"
        strokeLinecap="round"
        strokeOpacity="0.8"
      />
      <path
        d="M 52 16 C 60 12, 70 12, 78 17"
        stroke="#FFFFFF"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeOpacity="0.8"
      />

      {/* Optional Kawaii Sleeping/Smiling Face */}
      {withFace && (
        <g>
          {/* Eyes: sweet sleeping curved lines (◡ ◡) */}
          <path d="M 47 38 C 49 41, 53 41, 55 38" stroke="#754E41" strokeWidth="1.8" strokeLinecap="round" />
          <path d="M 67 38 C 69 41, 73 41, 75 38" stroke="#754E41" strokeWidth="1.8" strokeLinecap="round" />

          {/* Rosy Cheeks */}
          <ellipse cx="43" cy="42" rx="3.5" ry="2" fill="#FF8DA1" fillOpacity="0.7" />
          <ellipse cx="79" cy="42" rx="3.5" ry="2" fill="#FF8DA1" fillOpacity="0.7" />

          {/* Sweet Mouth (w) */}
          <path
            d="M 58 41 C 59.5 43, 61 43, 62 41 C 63 43, 64.5 43, 66 41"
            stroke="#754E41"
            strokeWidth="1.5"
            strokeLinecap="round"
            fill="none"
          />
        </g>
      )}

      {/* Optional Sparkles */}
      {withSparkles && (
        <g>
          <path
            d="M 12 18 Q 12 21, 9 21 Q 12 21, 12 24 Q 12 21, 15 21 Q 12 21, 12 18 Z"
            fill="#FFD166"
          />
          <path
            d="M 106 14 Q 106 17, 103 17 Q 106 17, 106 20 Q 106 17, 109 17 Q 106 17, 106 14 Z"
            fill="#FF8DA1"
          />
        </g>
      )}
    </svg>
  );
};

// ==========================================
// 2. TwinkleStar Component
// ==========================================
export interface TwinkleStarProps {
  /** Size in pixels (width and height). Default is 24. */
  size?: number;
  /** Fill color of the star. Default is '#FFD166'. */
  color?: string;
  /** Additional CSS class names */
  className?: string;
  /** Rotation angle in degrees. Default is 0. */
  rotate?: number;
  /** Whether to show a soft center glow aura. Default is false. */
  glow?: boolean;
}

export const TwinkleStar: React.FC<TwinkleStarProps> = ({
  size = 24,
  color = '#FFD166',
  className = '',
  rotate = 0,
  glow = false,
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`inline-block select-none overflow-visible ${className}`}
      style={rotate ? { transform: `rotate(${rotate}deg)` } : undefined}
      aria-hidden="true"
      role="presentation"
    >
      {/* Glow Aura */}
      {glow && (
        <circle cx="12" cy="12" r="10" fill={color} fillOpacity="0.25" />
      )}

      {/* 4-Point Kawaii Sparkle Diamond */}
      <path
        d="M 12 2 Q 12 12, 2 12 Q 12 12, 12 22 Q 12 12, 22 12 Q 12 12, 12 2 Z"
        fill={color}
      />

      {/* Center Bright Highlight Dot */}
      <circle cx="12" cy="12" r="1.5" fill="#FFFFFF" fillOpacity="0.8" />
    </svg>
  );
};

// ==========================================
// 3. RibbonBow Component
// ==========================================
export interface RibbonBowProps {
  /** Size in pixels (scales width). Default is 32. */
  size?: number;
  /** Primary ribbon color. Default is '#FF6B8B'. */
  color?: string;
  /** Darker shading/stroke color. Default is '#D63447'. */
  secondaryColor?: string;
  /** Additional CSS class names */
  className?: string;
}

export const RibbonBow: React.FC<RibbonBowProps> = ({
  size = 32,
  color = '#FF6B8B',
  secondaryColor = '#D63447',
  className = '',
}) => {
  const height = Math.round(size * 0.75);

  return (
    <svg
      width={size}
      height={height}
      viewBox="0 0 48 36"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`inline-block select-none overflow-visible ${className}`}
      aria-hidden="true"
      role="presentation"
    >
      {/* Left Loop */}
      <path
        d="M 23 16 C 10 4, 3 19, 21 21 Z"
        fill={color}
        stroke={secondaryColor}
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      {/* Left Loop Inner Fold Highlight */}
      <path
        d="M 16 12 C 10 16, 12 19, 19 18"
        stroke="#FFFFFF"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeOpacity="0.75"
      />

      {/* Right Loop */}
      <path
        d="M 25 16 C 38 4, 45 19, 27 21 Z"
        fill={color}
        stroke={secondaryColor}
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      {/* Right Loop Inner Fold Highlight */}
      <path
        d="M 32 12 C 38 16, 36 19, 29 18"
        stroke="#FFFFFF"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeOpacity="0.75"
      />

      {/* Left Ribbon Tail */}
      <path
        d="M 22 22 Q 16 28, 12 34 L 16 32 L 19 35 Q 22 28, 23 23 Z"
        fill={color}
        stroke={secondaryColor}
        strokeWidth="1.2"
        strokeLinejoin="round"
      />

      {/* Right Ribbon Tail */}
      <path
        d="M 26 22 Q 32 28, 36 34 L 32 32 L 29 35 Q 26 28, 25 23 Z"
        fill={color}
        stroke={secondaryColor}
        strokeWidth="1.2"
        strokeLinejoin="round"
      />

      {/* Center Ribbon Knot */}
      <ellipse
        cx="24"
        cy="18"
        rx="4.5"
        ry="4"
        fill={secondaryColor}
        stroke="#FFFFFF"
        strokeWidth="0.8"
      />
      <path
        d="M 22 17 Q 24 16, 26 17"
        stroke="#FFA4B4"
        strokeWidth="1"
        strokeLinecap="round"
      />
    </svg>
  );
};
