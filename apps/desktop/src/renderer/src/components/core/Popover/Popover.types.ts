import { ReactNode } from 'react';
import type { PopoverProps as AntPopoverProps } from 'antd';

export type TPopoverProps = Pick<AntPopoverProps, 'placement'> & {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  content: ReactNode;
  width?: number;
  children: ReactNode;
};
