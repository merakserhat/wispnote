import { GROUPS_WIDTH, NOTES_WIDTH, PANEL_RADIUS } from './QuickPaste.constants';
import { getMotion } from './QuickPaste.helpers';
import { useQuickPasteHooks } from './QuickPaste.hooks';
import { Frame, Panel } from './QuickPaste.styles';
import PasteGroups from './views/PasteGroups';
import PasteNotes from './views/PasteNotes';

function QuickPaste() {
  const {
    state,
    mode,
    focus,
    group,
    notes,
    layout,
    hasOnlyRecent,
    groupsPanelRef,
    notesPanelRef,
    groupListRef,
    noteListRef,
    onGroupsScroll,
    onNotesScroll,
    onGroupHover,
    onGroupPress,
    onNoteHover,
    onNotePress,
    onRetry,
  } = useQuickPasteHooks();

  const motion = getMotion(state.open);

  return (
    <Frame position="relative" width={state.frame.width} height={state.frame.height}>
      <Panel
        ref={groupsPanelRef}
        data-paste-hit
        role="dialog"
        aria-label="Paste a note"
        position="absolute"
        zIndex={1}
        left={layout.groupsLeft}
        top={layout.groupsTop}
        width={GROUPS_WIDTH}
        borderWidth={1}
        borderColor="borderDivider"
        borderRadius={PANEL_RADIUS}
        backgroundColor="backgroundElevated"
        opacity={motion.opacity}
        $transition={motion.transition}
        $visibility={motion.visibility}
        $pointerEvents={motion.pointerEvents}>
        <PasteGroups
          mode={mode}
          groups={state.groups}
          focus={focus}
          hasOnlyRecent={hasOnlyRecent}
          listRef={groupListRef}
          onScroll={onGroupsScroll}
          onHover={onGroupHover}
          onPress={onGroupPress}
          onRetry={onRetry}
        />
      </Panel>

      {mode === 'browse' && group && (
        <Panel
          ref={notesPanelRef}
          data-paste-hit
          position="absolute"
          left={layout.notesLeft}
          top={layout.notesTop}
          width={NOTES_WIDTH}
          borderWidth={1}
          borderColor="borderDivider"
          borderRadius={PANEL_RADIUS}
          backgroundColor="backgroundElevated"
          opacity={motion.opacity}
          $transition={motion.transition}
          $visibility={motion.visibility}
          $pointerEvents={motion.pointerEvents}>
          <PasteNotes
            group={group}
            notes={notes}
            focus={focus}
            listMaxHeight={layout.notesListMaxHeight}
            listRef={noteListRef}
            onScroll={onNotesScroll}
            onHover={onNoteHover}
            onPress={onNotePress}
          />
        </Panel>
      )}
    </Frame>
  );
}

export default QuickPaste;
