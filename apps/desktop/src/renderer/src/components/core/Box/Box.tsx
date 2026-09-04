import { TBoxProps } from './Box.types';
import { StyledBox } from './Box.styles';

function Box({ children, ...rest }: TBoxProps) {
  return <StyledBox {...rest}>{children}</StyledBox>;
}

export default Box;
