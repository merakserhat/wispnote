import { SEGMENTED_CONTROL_SIZE_MAP } from './SegmentedControl.constants';
import { StyledSegmented } from './SegmentedControl.styles';
import { TSegmentedControlProps, TSegmentedControlValue } from './SegmentedControl.types';

function SegmentedControl<TValue extends TSegmentedControlValue>({
  options,
  value,
  onChange,
  size = 'medium',
  block = false,
  className,
}: TSegmentedControlProps<TValue>) {
  function handleChange(next: unknown) {
    onChange(next as TValue);
  }

  return (
    <StyledSegmented
      className={className}
      options={options}
      value={value}
      onChange={handleChange}
      size={SEGMENTED_CONTROL_SIZE_MAP[size]}
      block={block}
    />
  );
}

export default SegmentedControl;
