import { useIconColor } from '../Icon.helpers';
import { TIconProps } from '../Icon.types';

function ArrowLeftIcon({ width = 24, height = 24, strokeWidth = 2, iconColor }: TIconProps) {
  const stroke = useIconColor(iconColor);

  return (
    <svg width={width} height={height} viewBox="0 0 24 24" fill="none">
      <path
        stroke={stroke}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={strokeWidth}
        d="M19 12H5M5 12L12 19M5 12L12 5"
      />
    </svg>
  );
}

export default ArrowLeftIcon;
