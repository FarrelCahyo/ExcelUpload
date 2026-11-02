import React, { useId } from 'react';

export interface StrawberryMilkBoxProps {
  /** Size in pixels (sets width and height proportionally). Default is 120. */
  size?: number;
  /** Whether to show the attached .xlsx spreadsheet badge. Default is false. */
  showExcelBadge?: boolean;
  /** Additional CSS class names */
  className?: string;
}

export const StrawberryMilkBox: React.FC<StrawberryMilkBoxProps> = ({
  size = 120,
  showExcelBadge = false,
  className = '',
}) => {
  const rawId = useId();
  const id = rawId.replace(/[^a-zA-Z0-9-_]/g, '');

  const frontGradId = `smb-front-${id}`;
  const sideGradId = `smb-side-${id}`;
  const roofFrontGradId = `smb-roof-f-${id}`;
  const roofSideGradId = `smb-roof-s-${id}`;
  const sealGradId = `smb-seal-${id}`;
  const dipGradId = `smb-dip-${id}`;
  const bowGradId = `smb-bow-${id}`;
  const berryGradId = `smb-berry-${id}`;
  const strawGradId = `smb-straw-${id}`;
  const excelGradId = `smb-excel-${id}`;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 160 180"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`inline-block select-none overflow-visible ${className}`}
      aria-label={showExcelBadge ? 'Strawberry Milk Carton with Excel Badge' : 'Strawberry Milk Carton'}
      role="img"
    >
      <defs>
        {/* Front face cream gradient */}
        <linearGradient id={frontGradId} x1="34" y1="76" x2="84" y2="154" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FFF9FA" />
          <stop offset="60%" stopColor="#FFF0F3" />
          <stop offset="100%" stopColor="#FFE3E8" />
        </linearGradient>

        {/* Side face shade gradient (depth) */}
        <linearGradient id={sideGradId} x1="84" y1="88" x2="126" y2="140" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FFCCD5" />
          <stop offset="100%" stopColor="#FFA4B4" />
        </linearGradient>

        {/* Front roof slope */}
        <linearGradient id={roofFrontGradId} x1="48" y1="42" x2="84" y2="88" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FFE6EC" />
          <stop offset="100%" stopColor="#FFD1DC" />
        </linearGradient>

        {/* Side roof slope */}
        <linearGradient id={roofSideGradId} x1="92" y1="52" x2="126" y2="74" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FFAEB9" />
          <stop offset="100%" stopColor="#FF94A6" />
        </linearGradient>

        {/* Top crimped seal */}
        <linearGradient id={sealGradId} x1="48" y1="30" x2="122" y2="42" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FFA4B4" />
          <stop offset="50%" stopColor="#FF8DA1" />
          <stop offset="100%" stopColor="#FFA4B4" />
        </linearGradient>

        {/* Lower pink dip panel */}
        <linearGradient id={dipGradId} x1="34" y1="114" x2="84" y2="154" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FF8DA1" />
          <stop offset="100%" stopColor="#FF6B8B" />
        </linearGradient>

        {/* Bow satin gradient */}
        <linearGradient id={bowGradId} x1="44" y1="78" x2="88" y2="114" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FF6B8B" />
          <stop offset="50%" stopColor="#FF4D6D" />
          <stop offset="100%" stopColor="#D63447" />
        </linearGradient>

        {/* Front Strawberry graphic */}
        <linearGradient id={berryGradId} x1="52" y1="92" x2="66" y2="108" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FF5C7A" />
          <stop offset="100%" stopColor="#C9184A" />
        </linearGradient>

        {/* Bendy straw gradient */}
        <linearGradient id={strawGradId} x1="106" y1="46" x2="136" y2="18" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="100%" stopColor="#FFF0F3" />
        </linearGradient>

        {/* Excel badge green gradient */}
        <linearGradient id={excelGradId} x1="102" y1="108" x2="138" y2="148" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#1E8E47" />
          <stop offset="60%" stopColor="#107C41" />
          <stop offset="100%" stopColor="#0B5A2E" />
        </linearGradient>
      </defs>

      {/* Ground Soft Shadow */}
      <ellipse cx="80" cy="158" rx="52" ry="11" fill="#F8BBD0" fillOpacity="0.45" />

      {/* Bendy Striped Straw (peeking out from top roof hole) */}
      <g>
        {/* Straw shadow hole */}
        <ellipse cx="106" cy="46" rx="4" ry="2.2" fill="#E63956" />

        {/* Straw main tube */}
        <path
          d="M 106 46 L 118 18 Q 120 14, 125 15 L 138 18"
          stroke={`url(#${strawGradId})`}
          strokeWidth="6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* Diagonal Pink Straw Stripes */}
        <path
          d="M 107 43 L 109 39 M 111 34 L 113 30 M 115 25 L 117 21 M 121 16 L 123 15 M 128 16.5 L 130 17 M 134 17.5 L 136 18"
          stroke="#FF4D6D"
          strokeWidth="3.5"
          strokeLinecap="butt"
        />
      </g>

      {/* Milk Carton Body & Gable Top */}
      <g>
        {/* Top Crimped Seal (Gable Fin) */}
        <path
          d="M 48 30 L 92 40 L 122 30 L 122 41 L 92 51 L 48 41 Z"
          fill={`url(#${sealGradId})`}
          stroke="#E63956"
          strokeWidth="1.2"
          strokeLinejoin="round"
        />
        {/* Crimping Ridge Lines on Seal */}
        <path
          d="M 56 32 L 56 42 M 64 34 L 64 44 M 72 36 L 72 46 M 80 37 L 80 47 M 88 39 L 88 49 M 98 38 L 98 48 M 106 35 L 106 45 M 114 33 L 114 43"
          stroke="#FFFFFF"
          strokeWidth="1.2"
          strokeLinecap="round"
          strokeOpacity="0.75"
        />

        {/* Front Roof Slope */}
        <path
          d="M 34 76 L 84 88 L 92 51 L 48 41 Z"
          fill={`url(#${roofFrontGradId})`}
          stroke="#FF8DA1"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
        {/* Left gable tuck fold triangle */}
        <path
          d="M 34 76 L 48 41 L 42 62 Z"
          fill="#FFCCD5"
          stroke="#FFA4B4"
          strokeWidth="1"
        />

        {/* Side Roof Slope (Depth) */}
        <path
          d="M 84 88 L 126 74 L 122 41 L 92 51 Z"
          fill={`url(#${roofSideGradId})`}
          stroke="#FF758F"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />

        {/* Front Face (Creamy Base) */}
        <path
          d="M 34 76 L 84 88 L 84 154 L 34 142 Z"
          fill={`url(#${frontGradId})`}
          stroke="#FF8DA1"
          strokeWidth="1.8"
          strokeLinejoin="round"
        />

        {/* Side Face (Depth Shading) */}
        <path
          d="M 84 88 L 126 74 L 126 140 L 84 154 Z"
          fill={`url(#${sideGradId})`}
          stroke="#FF758F"
          strokeWidth="1.8"
          strokeLinejoin="round"
        />

        {/* Front Face Lower Pink Dipped Wave */}
        <path
          d="M 34 116 Q 59 122, 84 121 L 84 154 L 34 142 Z"
          fill={`url(#${dipGradId})`}
          stroke="#FF4D6D"
          strokeWidth="1.2"
        />

        {/* Side Face Lower Pink Panel */}
        <path
          d="M 84 121 L 126 109 L 126 140 L 84 154 Z"
          fill="#FF758F"
          stroke="#FF4D6D"
          strokeWidth="1.2"
        />

        {/* Side Face Decorative Nutrition Grid & Hearts */}
        <g opacity="0.7">
          <line x1="92" y1="88" x2="118" y2="80" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="92" y1="94" x2="114" y2="87" stroke="#FFFFFF" strokeWidth="1" strokeLinecap="round" />
          <line x1="92" y1="99" x2="110" y2="93" stroke="#FFFFFF" strokeWidth="1" strokeLinecap="round" />
          {/* Mini Barcode on Side */}
          <rect x="94" y="124" width="22" height="10" rx="1.5" fill="#FFFFFF" fillOpacity="0.85" />
          <line x1="97" y1="126" x2="97" y2="132" stroke="#4A2E2B" strokeWidth="1" />
          <line x1="100" y1="126" x2="100" y2="132" stroke="#4A2E2B" strokeWidth="1.5" />
          <line x1="103" y1="126" x2="103" y2="132" stroke="#4A2E2B" strokeWidth="0.8" />
          <line x1="106" y1="126" x2="106" y2="132" stroke="#4A2E2B" strokeWidth="1.2" />
          <line x1="110" y1="126" x2="110" y2="132" stroke="#4A2E2B" strokeWidth="1.8" />
          <line x1="113" y1="126" x2="113" y2="132" stroke="#4A2E2B" strokeWidth="0.8" />
        </g>
      </g>

      {/* Front Face Graphic: "Strawberry Milk" Label & Strawberry Fruit */}
      <g>
        {/* Japanese Katakana Subtitle */}
        <text
          x="57"
          y="93"
          textAnchor="middle"
          fontSize="6.5"
          fontWeight="bold"
          fill="#D63447"
          fontFamily="system-ui, sans-serif"
          letterSpacing="0.8"
        >
          いちごミルク
        </text>

        {/* English Brand Text */}
        <text
          x="58"
          y="102"
          textAnchor="middle"
          fontSize="7.5"
          fontWeight="800"
          fill="#C9184A"
          fontFamily="system-ui, sans-serif"
          letterSpacing="0.2"
        >
          Strawberry
        </text>
        <text
          x="58"
          y="110"
          textAnchor="middle"
          fontSize="6"
          fontWeight="700"
          fill="#FF6B8B"
          fontFamily="system-ui, sans-serif"
          letterSpacing="0.6"
        >
          ★ MILK ★
        </text>

        {/* Printed Plump Strawberry Graphic on lower panel */}
        <g>
          {/* Strawberry Body */}
          <path
            d="M 58 143 C 51 139, 49 130, 54 126 C 56 124, 60 124, 62 126 C 67 130, 65 139, 58 143 Z"
            fill={`url(#${berryGradId})`}
          />
          {/* Strawberry Leaf Calyx */}
          <path
            d="M 54 126 C 52 124, 51 122, 53 121 C 55 123, 57 125, 58 126 C 59 125, 61 123, 63 121 C 65 122, 64 124, 62 126 Z"
            fill="#52B788"
          />
          {/* Strawberry Highlight */}
          <path
            d="M 52.5 128 C 51.5 131, 52 134, 54 136"
            stroke="#FFA4B4"
            strokeWidth="0.9"
            strokeLinecap="round"
          />
          {/* Tiny Yellow Seeds */}
          <circle cx="55" cy="131" r="0.5" fill="#FFE082" />
          <circle cx="60" cy="131" r="0.5" fill="#FFE082" />
          <circle cx="57.5" cy="135" r="0.5" fill="#FFE082" />
          <circle cx="58" cy="139" r="0.4" fill="#FFE082" />
        </g>
      </g>

      {/* Large Pink Satin Ribbon Bow (🎀 tied in front) */}
      <g>
        {/* Left Loop */}
        <path
          d="M 52 79 C 38 68, 30 84, 50 85 C 52 85, 53 84, 53 82 Z"
          fill={`url(#${bowGradId})`}
          stroke="#C9184A"
          strokeWidth="1.2"
          strokeLinejoin="round"
        />
        {/* Left Loop Inner Fold Shadow */}
        <path
          d="M 44 76 C 36 81, 40 84, 48 83"
          stroke="#FFCCD5"
          strokeWidth="1.5"
          strokeLinecap="round"
        />

        {/* Right Loop */}
        <path
          d="M 56 81 C 72 70, 80 84, 59 86 C 57 86, 56 84, 56 81 Z"
          fill={`url(#${bowGradId})`}
          stroke="#C9184A"
          strokeWidth="1.2"
          strokeLinejoin="round"
        />
        {/* Right Loop Inner Fold Shadow */}
        <path
          d="M 64 78 C 72 82, 68 85, 60 84"
          stroke="#FFCCD5"
          strokeWidth="1.5"
          strokeLinecap="round"
        />

        {/* Ribbon Tails Fluttering Down */}
        {/* Left Tail */}
        <path
          d="M 51 86 Q 44 98, 43 106 L 47 104 L 50 107 Q 53 98, 54 87 Z"
          fill={`url(#${bowGradId})`}
          stroke="#C9184A"
          strokeWidth="1"
          strokeLinejoin="round"
        />
        {/* Right Tail */}
        <path
          d="M 56 87 Q 62 98, 65 107 L 68 104 L 72 106 Q 66 98, 58 86 Z"
          fill={`url(#${bowGradId})`}
          stroke="#C9184A"
          strokeWidth="1"
          strokeLinejoin="round"
        />

        {/* Center Knot */}
        <ellipse cx="53.5" cy="83.5" rx="4.5" ry="4" fill="#FF4D6D" stroke="#C9184A" strokeWidth="1.2" />
        <path
          d="M 51 82 Q 53.5 81, 56 82"
          stroke="#FFCCD5"
          strokeWidth="1"
          strokeLinecap="round"
        />
      </g>

      {/* Decorative Sparkle Stars Around Carton */}
      <g>
        {/* Top-Left Sparkle (Golden) */}
        <path
          d="M 22 40 Q 22 45, 17 45 Q 22 45, 22 50 Q 22 45, 27 45 Q 22 45, 22 40 Z"
          fill="#FFD166"
        />
        {/* Top-Right Sparkle (Pink) */}
        <path
          d="M 140 50 Q 140 55, 135 55 Q 140 55, 140 60 Q 140 55, 145 55 Q 140 55, 140 50 Z"
          fill="#FF8DA1"
        />
        {/* Bottom-Left Sparkle (Pink) */}
        <circle cx="20" cy="130" r="1.5" fill="#FFA4B4" />
      </g>

      {/* Optional .xlsx Spreadsheet Badge Attachment */}
      {showExcelBadge && (
        <g>
          {/* Badge Glow / Shadow */}
          <rect
            x="100"
            y="110"
            width="46"
            height="46"
            rx="12"
            fill="#107C41"
            fillOpacity="0.25"
            transform="translate(2, 3)"
          />

          {/* Main Green Excel Tile Badge */}
          <rect
            x="100"
            y="110"
            width="46"
            height="46"
            rx="12"
            fill={`url(#${excelGradId})`}
            stroke="#A7F3D0"
            strokeWidth="2"
          />

          {/* Top-Right Folded Corner Accent */}
          <path
            d="M 134 110 L 146 122 L 134 122 Z"
            fill="#34D399"
          />
          <path
            d="M 134 110 L 134 122 L 146 122"
            stroke="#065F46"
            strokeWidth="1"
            fill="none"
          />

          {/* Spreadsheet Mini Grid Lines */}
          <rect x="107" y="118" width="16" height="14" rx="2" fill="#FFFFFF" fillOpacity="0.2" />
          <line x1="107" y1="125" x2="123" y2="125" stroke="#FFFFFF" strokeWidth="1" strokeOpacity="0.8" />
          <line x1="115" y1="118" x2="115" y2="132" stroke="#FFFFFF" strokeWidth="1" strokeOpacity="0.8" />

          {/* Bold "X" Icon Emblem */}
          <text
            x="115"
            y="130"
            textAnchor="middle"
            fontSize="11"
            fontWeight="900"
            fill="#FFFFFF"
            fontFamily="system-ui, sans-serif"
          >
            X
          </text>

          {/* .xlsx White Pill Tag */}
          <rect x="104" y="138" width="38" height="13" rx="6.5" fill="#FFFFFF" />
          <text
            x="123"
            y="147.5"
            textAnchor="middle"
            fontSize="8"
            fontWeight="800"
            fill="#107C41"
            fontFamily="system-ui, sans-serif"
            letterSpacing="0.2"
          >
            .xlsx
          </text>

          {/* Sparkle pop on badge corner */}
          <path
            d="M 144 106 Q 144 110, 140 110 Q 144 110, 144 114 Q 144 110, 148 110 Q 144 110, 144 106 Z"
            fill="#FFD166"
          />
        </g>
      )}
    </svg>
  );
};

export default StrawberryMilkBox;
