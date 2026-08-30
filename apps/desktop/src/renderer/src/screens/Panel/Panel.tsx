import Text from 'components/core/Text';

import { formatSelection } from './Panel.helpers';
import { usePanelHooks } from './Panel.hooks';
import { Actions, PanelRoot, Preview } from './Panel.styles';
import ActionButton from './views/ActionButton';
import CaptureHeader from './views/CaptureHeader';
import NoteField from './views/NoteField';

function Panel() {
  const {
    payload,
    mode,
    actions,
    noteText,
    pendingAction,
    setNoteText,
    onAction,
    onNoteKeyDown,
    onKeyDown,
  } = usePanelHooks();

  if (!payload) {
    return null;
  }

  const selection = formatSelection(payload.context);

  return (
    <PanelRoot role="presentation" tabIndex={-1} onKeyDown={onKeyDown}>
      <CaptureHeader context={payload.context} />

      <Preview $empty={!selection}>
        <Text variant="body">{selection || 'no selection'}</Text>
      </Preview>

      {mode === 'note' ? (
        <NoteField value={noteText} onChange={setNoteText} onKeyDown={onNoteKeyDown} />
      ) : (
        <Actions>
          {actions.map((item) => (
            <ActionButton
              key={item.action}
              action={item.action}
              label={item.label}
              primary={item.primary}
              disabled={item.disabled}
              loading={pendingAction === item.action}
              onAction={onAction}
            />
          ))}
        </Actions>
      )}
    </PanelRoot>
  );
}

export default Panel;
