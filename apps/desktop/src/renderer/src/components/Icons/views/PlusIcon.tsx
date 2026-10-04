import { useIconColor } from '../Icon.helpers';
import { TIconProps } from '../Icon.types';

function PlusIcon({ width = 24, height = 24, strokeWidth = 2, iconColor }: TIconProps) {
  const stroke = useIconColor(iconColor);

  return (
    <svg width={width} height={height} viewBox="0 0 24 24" fill="none">
      <path
        stroke={stroke}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={strokeWidth}
        d="M12 5V19M5 12H19"
      />
    </svg>
  );
}

export default PlusIcon;
