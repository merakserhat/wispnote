import type { SegmentedProps } from 'antd';

export type TSegmentedControlValue = string | number;

export type TSegmentedControlSize = 'small' | 'medium';

export type TSegmentedControlOption<TValue extends TSegmentedControlValue> = {
  label: string;
  value: TValue;
  disabled?: boolean;
};

export type TSegmentedControlProps<TValue extends TSegmentedControlValue> = {
  options: Array<TSegmentedControlOption<TValue>>;
  value: TValue;
  onChange: (value: TValue) => void;
  size?: TSegmentedControlSize;
  block?: boolean;
  className?: string;
};

export type TSegmentedControlSizeMap = Record<TSegmentedControlSize, SegmentedProps['size']>;
