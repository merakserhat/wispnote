import Box from 'components/core/Box';
import Text from 'components/core/Text';

import { TPasteGroupsProps } from 'screens/QuickPaste';

import { GROUP_ROW_HEIGHT, GROUP_ROWS_MAX } from '../QuickPaste.constants';
import { getGroupTone } from '../QuickPaste.helpers';
import { List } from '../QuickPaste.styles';

import PasteError from './PasteError';
import PasteGroupRow from './PasteGroupRow';
import PasteGroupsSkeleton from './PasteGroupsSkeleton';

const LIST_MAX_HEIGHT = GROUP_ROWS_MAX * (GROUP_ROW_HEIGHT + 2) + 18;

function PasteGroups({
  mode,
  groups,
  focus,
  hasOnlyRecent,
  listRef,
  onScroll,
  onHover,
  onPress,
  onRetry,
}: TPasteGroupsProps) {
  return (
    <>
      {mode === 'nothing' && (
        <Box gap="xs" pt="sm" px="sm" pb="m">
          <Text variant="bodySubBold">Nothing to paste yet</Text>
          <Text variant="caption" color="textSecondary">
            Select text anywhere and press ⌃ then ⇧ to save it. Your notes show up here.
          </Text>
        </Box>
      )}

      {mode === 'error' && <PasteError onRetry={onRetry} />}

      {mode === 'first' && <PasteGroupsSkeleton />}

      {mode === 'browse' && (
        <List
          ref={listRef}
          maxHeight={LIST_MAX_HEIGHT}
          overflowY="auto"
          gap="xxs"
          p="xs"
          onScroll={onScroll}>
          {groups.map((group, index) => (
            <Box key={group.key} flexShrink={0}>
              <PasteGroupRow
                group={group}
                index={index}
                tone={getGroupTone(index, focus)}
                onHover={onHover}
                onPress={onPress}
              />
              {group.recent && groups.length > 1 && (
                <Box flexShrink={0} height="1px" mx="s" my="xs" backgroundColor="borderDivider" />
              )}
            </Box>
          ))}
          {hasOnlyRecent && (
            <Box gap="xxs" pt="s" px="s" pb="s">
              <Text variant="bodySubBold">No groups yet</Text>
              <Text variant="caption" color="textSecondary">
                Put notes in a group in WispNote and the group shows up here.
              </Text>
            </Box>
          )}
        </List>
      )}
    </>
  );
}

export default PasteGroups;
