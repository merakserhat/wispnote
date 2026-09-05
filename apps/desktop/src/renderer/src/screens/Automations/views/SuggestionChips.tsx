import Box from 'components/core/Box';
import Text from 'components/core/Text';

import { useGetAutomationSuggestions } from 'api/automations';

import { TSuggestionChipsProps } from '../Automations.types';
import SuggestionChip from './SuggestionChip';

function SuggestionChips({ onSelect }: TSuggestionChipsProps) {
  const { data } = useGetAutomationSuggestions();

  if (!data?.length) {
    return <></>;
  }

  return (
    <Box gap="s">
      <Text variant="bodySub" color="textTertiary">
        Try one of these:
      </Text>
      <Box flexDirection="row" flexWrap="wrap" gap="s">
        {data.map((suggestion) => (
          <SuggestionChip key={suggestion.id} suggestion={suggestion} onSelect={onSelect} />
        ))}
      </Box>
    </Box>
  );
}

export default SuggestionChips;
