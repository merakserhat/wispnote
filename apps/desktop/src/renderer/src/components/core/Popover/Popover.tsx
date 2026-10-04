import { Popover as AntPopover } from 'antd';

import Box from 'components/core/Box';

import { POPOVER_STYLES, POPOVER_WIDTH } from './Popover.constants';
import { PopoverTrigger } from './Popover.styles';
import { TPopoverProps } from './Popover.types';

function Popover({
  open,
  onOpenChange,
  content,
  placement = 'bottomRight',
  width = POPOVER_WIDTH,
  children,
}: TPopoverProps) {
  return (
    <AntPopover
      open={open}
      onOpenChange={onOpenChange}
      trigger="click"
      placement={placement}
      arrow={false}
      destroyOnHidden
      styles={POPOVER_STYLES}
      content={<Box width={width}>{content}</Box>}>
      <PopoverTrigger>{children}</PopoverTrigger>
    </AntPopover>
  );
}

export default Popover;
