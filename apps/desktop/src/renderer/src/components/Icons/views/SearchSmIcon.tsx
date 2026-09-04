import { useIconColor } from '../Icon.helpers';
import { TIconProps } from '../Icon.types';

function SearchSmIcon({ width = 24, height = 24, strokeWidth = 2, iconColor }: TIconProps) {
  const stroke = useIconColor(iconColor);

  return (
    <svg width={width} height={height} viewBox="0 0 24 24" fill="none">
      <path
        d="M21 21L15.0001 15M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z"
        stroke={stroke}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default SearchSmIcon;
