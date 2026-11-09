import { useIconColor } from '../Icon.helpers';
import { TIconProps } from '../Icon.types';

function Loading01Icon({ width = 24, height = 24, strokeWidth = 2.4, iconColor }: TIconProps) {
  const stroke = useIconColor(iconColor);

  return (
    <svg width={width} height={height} viewBox="0 0 24 24" fill="none">
      <path
        stroke={stroke}
        strokeLinecap="round"
        strokeWidth={strokeWidth}
        d="M21 12a9 9 0 1 1-6.22-8.56"
      />
    </svg>
  );
}

export default Loading01Icon;
