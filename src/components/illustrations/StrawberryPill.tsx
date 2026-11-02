import React, { useId } from 'react';

export interface StrawberryPillProps {
  /** Whether this strawberry is in the active/selected state. Default is false. */
  active?: boolean;
  /** Size in pixels (sets width, height scales proportionally). Default is 32. */
  size?: number;
  /** Additional CSS class names */
  className?: string;
  /** Optional content (e.g. date number, label) to render centered over the strawberry */
  children?: React.ReactNode;
}

export const StrawberryPill: React.FC<StrawberryPillProps> = ({
  active = false,
  size = 32,
  className = '',
  children,
}) => {
  const rawId = useId();
  const id = rawId.replace(/[^a-zA-Z0-9-_]/g, '');

  const berryGradId = `sp-berry-${id}`;
  const leafGradId = `sp-leaf-${id}`;

  const height = Math.round(size * 1.18);

  const svgContent = (
    <svg
      width={size}
      height={height}
      viewBox="0 0 44 52"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="select-none overflow-visible"
      aria-hidden={children ? 'true' : undefined}
      role={children ? 'presentation' : 'img'}
      aria-label={!children ? (active ? 'Active Strawberry' : 'Strawberry') : undefined}
    >
      <defs>
        {/* Active Vibrant Strawberry Gradient */}
        <linearGradient id={berryGradId} x1="22" y1="13" x2="22" y2="49" gradientUnits="userSpaceOnUse">
          {active ? (
            <>
              <stop offset="0%" stopColor="#FF4D6D" />
              <stop offset="50%" stopColor="#D63447" />
              <stop offset="100%" stopColor="#B5173B" />
            </>
          ) : (
            <>
              <stop offset="0%" stopColor="#FFF9FA" />
              <stop offset="50%" stopColor="#FFF0F3" />
              <stop offset="100%" stopColor="#FFE3E8" />
            </>
          )}
        </linearGradient>

        {/* Leaves Green Gradient */}
        <linearGradient id={leafGradId} x1="22" y1="3" x2="22" y2="20" gradientUnits="userSpaceOnUse">
          {active ? (
            <>
              <stop offset="0%" stopColor="#6BCB77" />
              <stop offset="100%" stopColor="#40916C" />
            </>
          ) : (
            <>
              <stop offset="0%" stopColor="#C8E6C9" />
              <stop offset="100%" stopColor="#A8D5BA" />
            </>
          )}
        </linearGradient>
      </defs>

      {/* Active Glow / Shadow */}
      {active && (
        <ellipse cx="22" cy="50" rx="14" ry="3" fill="#D63447" fillOpacity="0.3" />
      )}

      {/* Strawberry Body */}
      <path
        d="M 22 49 C 11 44, 6 32, 10 20 C 12 15, 17 13, 22 13 C 27 13, 32 15, 34 20 C 38 32, 33 44, 22 49 Z"
        fill={`url(#${berryGradId})`}
        stroke={active ? '#A01530' : '#FFB6C1'}
        strokeWidth={active ? '1.5' : '1.8'}
        strokeLinejoin="round"
      />

      {/* Gloss Highlight Arc on Upper-Left Shoulder */}
      <path
        d="M 13 21 C 10 26, 11 31, 14 36"
        stroke={active ? '#FFA4B4' : '#FFFFFF'}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeOpacity={active ? 0.75 : 0.9}
      />

      {/* Seed Dots */}
      <g fill={active ? '#FFE082' : '#FFCCD5'}>
        <circle cx="18" cy="22" r="0.75" />
        <circle cx="26" cy="22" r="0.75" />
        <circle cx="14" cy="28" r="0.75" />
        <circle cx="22" cy="28" r="0.75" />
        <circle cx="30" cy="28" r="0.75" />
        <circle cx="17" cy="35" r="0.75" />
        <circle cx="27" cy="35" r="0.75" />
        <circle cx="22" cy="42" r="0.65" />
      </g>

      {/* Strawberry Stem */}
      <path
        d="M 22 13 C 22 8, 23 5, 26 3"
        fill="none"
        stroke={active ? '#388E3C' : '#81C784'}
        strokeWidth="2.2"
        strokeLinecap="round"
      />

      {/* Calyx Leaves Crown */}
      <g fill={`url(#${leafGradId})`} stroke={active ? '#2D6A4F' : '#81C784'} strokeWidth="0.8">
        {/* Far-left leaf */}
        <path d="M 22 13 C 16 11, 10 13, 8 16 C 12 18, 18 16, 22 14 Z" />
        {/* Mid-left leaf */}
        <path d="M 22 13 C 18 14, 14 18, 14 22 C 18 20, 20 16, 22 14 Z" />
        {/* Center leaf */}
        <path d="M 20 14 L 22 18 L 24 14 Z" />
        {/* Mid-right leaf */}
        <path d="M 22 14 C 24 16, 26 20, 30 22 C 30 18, 26 14, 22 13 Z" />
        {/* Far-right leaf */}
        <path d="M 22 14 C 26 16, 32 18, 36 16 C 34 13, 28 11, 22 13 Z" />
      </g>
    </svg>
  );

  // If children are provided, wrap in a container with content placed over the strawberry
  if (children) {
    return (
      <div
        className={`relative inline-flex flex-col items-center justify-center ${className}`}
        style={{ width: size, height }}
      >
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          {svgContent}
        </div>
        <div className="relative z-10 pt-2 flex flex-col items-center justify-center">
          {children}
        </div>
      </div>
    );
  }

  return <div className={`inline-block ${className}`}>{svgContent}</div>;
};

export default StrawberryPill;
