import Card from 'components/core/Card';
import Text from 'components/core/Text';

import { TSuggestionChipProps } from '../Automations.types';

function SuggestionChip({ suggestion, onSelect }: TSuggestionChipProps) {
  function handlePress() {
    onSelect(suggestion);
  }

  return (
    <Card variant="outlined" px="sm" py="xs" borderRadius={20} onPress={handlePress}>
      <Text variant="bodySub" color="textSecondary">
        {suggestion.ruleText}
      </Text>
    </Card>
  );
}

export default SuggestionChip;
