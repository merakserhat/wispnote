import Text from 'components/core/Text';

import useToast from 'hooks/useToast';

import { HudRoot } from './Hud.styles';

function Hud() {
  const { toast, visible } = useToast();

  return (
    <HudRoot $visible={visible}>
      <Text variant="bodySubBold" numberOfLines={1}>
        {toast?.message ?? ''}
      </Text>
      {Boolean(toast?.detail) && (
        <Text variant="caption" color="textSecondary" numberOfLines={1}>
          {toast?.detail}
        </Text>
      )}
    </HudRoot>
  );
}

export default Hud;
