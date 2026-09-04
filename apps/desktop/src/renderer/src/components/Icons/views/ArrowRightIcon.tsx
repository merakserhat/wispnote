import { useIconColor } from '../Icon.helpers';
import { TIconProps } from '../Icon.types';

function ArrowRightIcon({ width = 24, height = 24, strokeWidth = 2, iconColor }: TIconProps) {
  const stroke = useIconColor(iconColor);

  return (
    <svg width={width} height={height} viewBox="0 0 24 24" fill="none">
      <path
        d="M5 12H19M19 12L12 5M19 12L12 19"
        stroke={stroke}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default ArrowRightIcon;
