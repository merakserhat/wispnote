import { useIconColor } from '../Icon.helpers';
import { TIconProps } from '../Icon.types';

function WispLogoIcon({ width = 24, height = 24, strokeWidth = 2, iconColor }: TIconProps) {
  const stroke = useIconColor(iconColor);

  return (
    <svg width={width} height={height} viewBox="0 0 24 24" fill="none">
      <path
        stroke={stroke}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={strokeWidth}
        d="M3 7C7 7 7 17 12 17C17 17 17 7 21 7"
      />
    </svg>
  );
}

export default WispLogoIcon;
