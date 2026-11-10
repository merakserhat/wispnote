import { useIconColor } from '../Icon.helpers';
import { TIconProps } from '../Icon.types';

function RefreshCw01Icon({ width = 24, height = 24, strokeWidth = 2, iconColor }: TIconProps) {
  const stroke = useIconColor(iconColor);

  return (
    <svg width={width} height={height} viewBox="0 0 24 24" fill="none">
      <path
        stroke={stroke}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={strokeWidth}
        d="M20 11A8 8 0 0 0 5.3 7M4 13A8 8 0 0 0 18.7 17M4 3.5V7.5H8M20 20.5V16.5H16"
      />
    </svg>
  );
}

export default RefreshCw01Icon;
