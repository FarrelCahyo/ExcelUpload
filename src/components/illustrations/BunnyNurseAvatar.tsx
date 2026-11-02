import React, { useId } from 'react';

export interface BunnyNurseAvatarProps {
  /** Size in pixels (sets width and height). Default is 96. */
  size?: number;
  /** Additional CSS class names */
  className?: string;
  /** Whether to show sparkle stars around the avatar. Default is true. */
  showSparkles?: boolean;
  /** Whether to show outer dashed decorative border. Default is true. */
  showBorder?: boolean;
}

export const BunnyNurseAvatar: React.FC<BunnyNurseAvatarProps> = ({
  size = 96,
  className = '',
  showSparkles = true,
  showBorder = true,
}) => {
  const rawId = useId();
  // Sanitize useId string for valid SVG id attributes
  const id = rawId.replace(/[^a-zA-Z0-9-_]/g, '');

  const bgGradId = `bna-bg-${id}`;
  const earGradLId = `bna-ear-l-${id}`;
  const earGradRId = `bna-ear-r-${id}`;
  const hairGradId = `bna-hair-${id}`;
  const berryGradId = `bna-berry-${id}`;
  const capGradId = `bna-cap-${id}`;
  const skinGradId = `bna-skin-${id}`;
  const clipId = `bna-circle-clip-${id}`;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 140 140"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`inline-block select-none overflow-visible ${className}`}
      aria-label="Afiz Bunny Nurse Avatar"
      role="img"
    >
      <defs>
        {/* Background gradient */}
        <linearGradient id={bgGradId} x1="70" y1="8" x2="70" y2="132" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FFF5F7" />
          <stop offset="50%" stopColor="#FFE4E8" />
          <stop offset="100%" stopColor="#FFD1DC" />
        </linearGradient>

        {/* Ear pink gradients */}
        <linearGradient id={earGradLId} x1="42" y1="12" x2="48" y2="40" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FFCCD5" />
          <stop offset="100%" stopColor="#FFA4B4" />
        </linearGradient>
        <linearGradient id={earGradRId} x1="98" y1="14" x2="92" y2="42" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FFCCD5" />
          <stop offset="100%" stopColor="#FFA4B4" />
        </linearGradient>

        {/* Hair gradient */}
        <linearGradient id={hairGradId} x1="70" y1="36" x2="70" y2="92" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#8D6253" />
          <stop offset="50%" stopColor="#754E41" />
          <stop offset="100%" stopColor="#5E3A2F" />
        </linearGradient>

        {/* Skin gradient */}
        <linearGradient id={skinGradId} x1="70" y1="46" x2="70" y2="90" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FFF8F4" />
          <stop offset="100%" stopColor="#FFEBE0" />
        </linearGradient>

        {/* Strawberry gradient */}
        <linearGradient id={berryGradId} x1="64" y1="96" x2="76" y2="114" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FF5C7A" />
          <stop offset="60%" stopColor="#E63956" />
          <stop offset="100%" stopColor="#C9184A" />
        </linearGradient>

        {/* Nurse Cap gradient */}
        <linearGradient id={capGradId} x1="70" y1="20" x2="70" y2="38" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="100%" stopColor="#F8F3F5" />
        </linearGradient>

        {/* Circle Clip for inner body framing */}
        <clipPath id={clipId}>
          <circle cx="70" cy="70" r="58" />
        </clipPath>
      </defs>

      {/* Outer Glow / Drop Shadow circle */}
      <circle cx="70" cy="72" r="60" fill="#FF8DA1" fillOpacity="0.15" />

      {/* Main Avatar Circular Frame */}
      <circle
        cx="70"
        cy="70"
        r="59"
        fill={`url(#${bgGradId})`}
        stroke="#FFA4B4"
        strokeWidth="2.5"
      />

      {/* Inner decorative dashed ring */}
      {showBorder && (
        <circle
          cx="70"
          cy="70"
          r="54"
          fill="none"
          stroke="#FFB6C1"
          strokeWidth="1.5"
          strokeDasharray="4 3"
          strokeOpacity="0.8"
        />
      )}

      {/* Group clipped to circle for shoulders, hair back & uniform */}
      <g clipPath={`url(#${clipId})`}>
        {/* Soft back hair mass */}
        <ellipse cx="70" cy="74" rx="34" ry="30" fill={`url(#${hairGradId})`} />

        {/* Nurse Uniform / Shoulders */}
        <path
          d="M 32 136 C 32 110, 48 98, 70 98 C 92 98, 108 110, 108 136 Z"
          fill="#FFFFFF"
          stroke="#F8BBD0"
          strokeWidth="1.5"
        />

        {/* Uniform collar pink piping */}
        <path
          d="M 54 98 L 70 110 L 86 98"
          fill="none"
          stroke="#FFA4B4"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Nurse Apron Bib Stitching */}
        <path
          d="M 52 114 L 52 136 M 88 114 L 88 136"
          stroke="#FFCCD5"
          strokeWidth="1.5"
          strokeDasharray="2 2"
        />

        {/* Tiny stitched pocket with heart */}
        <rect x="42" y="112" width="12" height="10" rx="2" fill="#FFF0F3" stroke="#FFA4B4" strokeWidth="1" />
        <path
          d="M 48 115 C 47 114, 45 115, 45 116.5 C 45 118, 48 120, 48 120 C 48 120, 51 118, 51 116.5 C 51 115, 49 114, 48 115 Z"
          fill="#FF6B8B"
        />
      </g>

      {/* Bunny Ears (sitting tall above the head) */}
      <g>
        {/* Left Bunny Ear */}
        <g>
          {/* Ear Outer White */}
          <path
            d="M 46 46 C 42 32, 38 12, 47 8 C 56 6, 57 26, 52 46 Z"
            fill="#FFFFFF"
            stroke="#FFD1DC"
            strokeWidth="1.8"
            strokeLinejoin="round"
          />
          {/* Ear Inner Pink */}
          <path
            d="M 47 38 C 44 28, 42 16, 47 13 C 51 12, 53 24, 49 38 Z"
            fill={`url(#${earGradLId})`}
          />
        </g>

        {/* Right Bunny Ear (Cute tilted angle) */}
        <g>
          {/* Ear Outer White */}
          <path
            d="M 88 46 C 92 30, 96 10, 105 12 C 113 15, 104 34, 95 46 Z"
            fill="#FFFFFF"
            stroke="#FFD1DC"
            strokeWidth="1.8"
            strokeLinejoin="round"
          />
          {/* Ear Inner Pink */}
          <path
            d="M 92 38 C 95 26, 98 16, 103 17 C 107 19, 100 32, 94 38 Z"
            fill={`url(#${earGradRId})`}
          />
        </g>
      </g>

      {/* Head & Face */}
      <g>
        {/* Face Base */}
        <path
          d="M 44 58 C 44 76, 54 88, 70 88 C 86 88, 96 76, 96 58 C 96 46, 44 46, 44 58 Z"
          fill={`url(#${skinGradId})`}
        />

        {/* Hair Bangs & Sides */}
        {/* Left side hair strand */}
        <path
          d="M 44 52 C 40 60, 40 70, 44 76 C 45 74, 47 64, 46 56 Z"
          fill={`url(#${hairGradId})`}
        />
        {/* Right side hair strand */}
        <path
          d="M 96 52 C 100 60, 100 70, 96 76 C 95 74, 93 64, 94 56 Z"
          fill={`url(#${hairGradId})`}
        />
        {/* Front Rounded Bangs */}
        <path
          d="M 44 52 C 48 62, 56 63, 60 56 C 64 64, 76 64, 80 56 C 84 63, 92 62, 96 52 C 96 42, 44 42, 44 52 Z"
          fill={`url(#${hairGradId})`}
        />
        {/* Hair Gloss Highlight Arc */}
        <path
          d="M 52 48 C 60 44, 80 44, 88 48"
          stroke="#B0897B"
          strokeWidth="2"
          strokeLinecap="round"
          strokeOpacity="0.7"
        />

        {/* Nurse Cap */}
        <g>
          {/* Cap Base */}
          <path
            d="M 50 34 C 50 20, 90 20, 90 34 L 86 40 L 54 40 Z"
            fill={`url(#${capGradId})`}
            stroke="#FFB6C1"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
          {/* Cap Fold Line */}
          <path
            d="M 52 36 L 88 36"
            stroke="#FFCCD5"
            strokeWidth="1.2"
          />
          {/* Medical Cross (Strawberry Red) */}
          <path
            d="M 68 25 L 72 25 L 72 28 L 75 28 L 75 32 L 72 32 L 72 35 L 68 35 L 68 32 L 65 32 L 65 28 L 68 28 Z"
            fill="#E63956"
          />
        </g>

        {/* Eyes (Anime / Kawaii Chibi) */}
        {/* Left Eye */}
        <g>
          {/* Upper Lash */}
          <path
            d="M 51 63 C 53 60, 58 60, 60 63"
            stroke="#4A2E2B"
            strokeWidth="2.4"
            strokeLinecap="round"
          />
          {/* Iris */}
          <ellipse cx="56" cy="66" rx="3.5" ry="4.5" fill="#4A2E2B" />
          <ellipse cx="56" cy="67" rx="2.5" ry="3.5" fill="#6B433D" />
          {/* Catchlight sparkles */}
          <circle cx="54.5" cy="64.5" r="1.5" fill="#FFFFFF" />
          <circle cx="57.5" cy="67.5" r="0.9" fill="#FFFFFF" />
        </g>

        {/* Right Eye */}
        <g>
          {/* Upper Lash */}
          <path
            d="M 80 63 C 82 60, 87 60, 89 63"
            stroke="#4A2E2B"
            strokeWidth="2.4"
            strokeLinecap="round"
          />
          {/* Iris */}
          <ellipse cx="84" cy="66" rx="3.5" ry="4.5" fill="#4A2E2B" />
          <ellipse cx="84" cy="67" rx="2.5" ry="3.5" fill="#6B433D" />
          {/* Catchlight sparkles */}
          <circle cx="82.5" cy="64.5" r="1.5" fill="#FFFFFF" />
          <circle cx="85.5" cy="67.5" r="0.9" fill="#FFFFFF" />
        </g>

        {/* Rosy Cheeks */}
        {/* Left Cheek */}
        <g>
          <ellipse cx="49" cy="72" rx="4.5" ry="2.8" fill="#FF8DA1" fillOpacity="0.65" />
          <line x1="47" y1="71" x2="49" y2="73" stroke="#FF5C7A" strokeWidth="1" strokeLinecap="round" />
          <line x1="50" y1="71" x2="52" y2="73" stroke="#FF5C7A" strokeWidth="1" strokeLinecap="round" />
        </g>
        {/* Right Cheek */}
        <g>
          <ellipse cx="91" cy="72" rx="4.5" ry="2.8" fill="#FF8DA1" fillOpacity="0.65" />
          <line x1="89" y1="71" x2="91" y2="73" stroke="#FF5C7A" strokeWidth="1" strokeLinecap="round" />
          <line x1="92" y1="71" x2="94" y2="73" stroke="#FF5C7A" strokeWidth="1" strokeLinecap="round" />
        </g>

        {/* Sweet Smile */}
        <path
          d="M 66 73 C 68 77, 72 77, 74 73"
          stroke="#4A2E2B"
          strokeWidth="1.8"
          strokeLinecap="round"
          fill="#FF6B8B"
        />
      </g>

      {/* Chibi Hands Holding Strawberry */}
      <g>
        {/* Strawberry Fruit */}
        <g>
          {/* Strawberry Body */}
          <path
            d="M 70 114 C 62 110, 60 99, 66 95 C 69 93, 71 93, 74 95 C 80 99, 78 110, 70 114 Z"
            fill={`url(#${berryGradId})`}
            stroke="#B5173B"
            strokeWidth="0.8"
          />
          {/* Strawberry Gloss Highlight */}
          <path
            d="M 64 97 C 62 101, 63 105, 65 107"
            stroke="#FFA4B4"
            strokeWidth="1.2"
            strokeLinecap="round"
          />
          {/* Green Calyx Leaves */}
          <path
            d="M 66 95 C 63 93, 62 90, 64 89 C 67 92, 69 94, 70 95 C 71 94, 73 92, 76 89 C 78 90, 77 93, 74 95 C 72 96, 68 96, 66 95 Z"
            fill="#52B788"
          />
          <path
            d="M 70 94 L 70 91"
            stroke="#40916C"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          {/* Strawberry Golden Seeds */}
          <circle cx="67" cy="100" r="0.6" fill="#FFE082" />
          <circle cx="72" cy="100" r="0.6" fill="#FFE082" />
          <circle cx="69" cy="104" r="0.6" fill="#FFE082" />
          <circle cx="66" cy="106" r="0.6" fill="#FFE082" />
          <circle cx="73" cy="106" r="0.6" fill="#FFE082" />
          <circle cx="70" cy="110" r="0.5" fill="#FFE082" />
        </g>

        {/* Chibi Hands Clasping */}
        {/* Left Hand */}
        <circle cx="62" cy="102" r="3.2" fill="#FFEBE0" stroke="#F8BBD0" strokeWidth="0.8" />
        {/* Right Hand */}
        <circle cx="78" cy="102" r="3.2" fill="#FFEBE0" stroke="#F8BBD0" strokeWidth="0.8" />
      </g>

      {/* Floating Kawaii Sparkle Stars (✨) */}
      {showSparkles && (
        <g>
          {/* Top-Right Star (Golden) */}
          <path
            d="M 118 28 Q 118 34, 112 34 Q 118 34, 118 40 Q 118 34, 124 34 Q 118 34, 118 28 Z"
            fill="#FFD166"
          />
          <circle cx="122" cy="26" r="1.2" fill="#FFE082" />

          {/* Top-Left Star (Pink) */}
          <path
            d="M 22 30 Q 22 35, 17 35 Q 22 35, 22 40 Q 22 35, 27 35 Q 22 35, 22 30 Z"
            fill="#FF8DA1"
          />
          <circle cx="18" cy="44" r="1" fill="#FFA4B4" />

          {/* Bottom-Left Star (Golden) */}
          <path
            d="M 18 90 Q 18 94, 14 94 Q 18 94, 18 98 Q 18 94, 22 94 Q 18 94, 18 90 Z"
            fill="#FFD166"
          />

          {/* Bottom-Right Star (Pink) */}
          <path
            d="M 122 86 Q 122 91, 117 91 Q 122 91, 122 96 Q 122 91, 127 91 Q 122 91, 122 86 Z"
            fill="#FF8DA1"
          />

          {/* Top Center Tiny Star */}
          <path
            d="M 70 8 Q 70 11, 67 11 Q 70 11, 70 14 Q 70 11, 73 11 Q 70 11, 70 8 Z"
            fill="#FFD166"
          />
        </g>
      )}
    </svg>
  );
};

export default BunnyNurseAvatar;
