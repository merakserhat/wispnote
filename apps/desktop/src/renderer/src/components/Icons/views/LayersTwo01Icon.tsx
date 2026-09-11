import { useIconColor } from '../Icon.helpers';
import { TIconProps } from '../Icon.types';

function LayersTwo01Icon({ width = 24, height = 24, strokeWidth = 2, iconColor }: TIconProps) {
  const stroke = useIconColor(iconColor);

  return (
    <svg width={width} height={height} viewBox="0 0 24 24" fill="none">
      <path
        stroke={stroke}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={strokeWidth}
        d="M2 12L11.6422 16.8211C11.7734 16.8867 11.839 16.9195 11.9078 16.9324C11.9687 16.9438 12.0313 16.9438 12.0922 16.9324C12.161 16.9195 12.2266 16.8867 12.3578 16.8211L22 12M2 7L11.6422 2.17889C11.7734 2.11327 11.839 2.08045 11.9078 2.06754C11.9687 2.05612 12.0313 2.05612 12.0922 2.06754C12.161 2.08045 12.2266 2.11327 12.3578 2.17889L22 7L12.3578 11.8211C12.2266 11.8867 12.161 11.9195 12.0922 11.9324C12.0313 11.9438 11.9687 11.9438 11.9078 11.9324C11.839 11.9195 11.7734 11.8867 11.6422 11.8211L2 7Z"
      />
    </svg>
  );
}

export default LayersTwo01Icon;
