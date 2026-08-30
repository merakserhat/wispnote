import Text from 'components/core/Text';

import useToast from 'hooks/useToast';

import { HudRoot } from './Hud.styles';

function Hud() {
  const { toast, visible } = useToast();

  return (
    <HudRoot $visible={visible}>
      <Text variant="title" truncate>
        {toast?.message ?? ''}
      </Text>
      {Boolean(toast?.detail) && (
        <Text variant="meta" muted truncate>
          {toast?.detail}
        </Text>
      )}
    </HudRoot>
  );
}

export default Hud;
