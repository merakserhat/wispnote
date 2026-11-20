import { useIconColor } from '../Icon.helpers';
import { TIconProps } from '../Icon.types';

function ChevronRightIcon({ width = 24, height = 24, strokeWidth = 2, iconColor }: TIconProps) {
  const stroke = useIconColor(iconColor);

  return (
    <svg width={width} height={height} viewBox="0 0 24 24" fill="none">
      <path
        stroke={stroke}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={strokeWidth}
        d="M9 6L15 12L9 18"
      />
    </svg>
  );
}

export default ChevronRightIcon;
