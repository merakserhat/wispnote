import Button from 'components/core/Button';

import { TActionButtonProps } from '../Panel.types';

function ActionButton({ action, label, primary, disabled, loading, onAction }: TActionButtonProps) {
  function handlePress() {
    onAction(action);
  }

  return (
    <Button
      label={label}
      variant={primary ? 'primary' : 'secondary'}
      disabled={disabled}
      loading={loading}
      onPress={handlePress}
    />
  );
}

export default ActionButton;
