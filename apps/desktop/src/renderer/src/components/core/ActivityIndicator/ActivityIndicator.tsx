import { Loading01Icon } from 'components/Icons';

import { ACTIVITY_INDICATOR_DEFAULT_SIZE } from './ActivityIndicator.constants';
import { ActivityIndicatorRoot } from './ActivityIndicator.styles';
import { TActivityIndicatorProps } from './ActivityIndicator.types';

function ActivityIndicator({
  color,
  size = ACTIVITY_INDICATOR_DEFAULT_SIZE,
  className,
}: TActivityIndicatorProps) {
  return (
    <ActivityIndicatorRoot className={className} role="status" aria-label="Loading">
      <Loading01Icon width={size} height={size} iconColor={color} />
    </ActivityIndicatorRoot>
  );
}

export default ActivityIndicator;
