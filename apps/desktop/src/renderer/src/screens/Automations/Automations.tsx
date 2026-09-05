import Box from 'components/core/Box';
import PageHeader from 'components/PageHeader';

import { AUTOMATIONS_PAGE_DESCRIPTION } from './Automations.constants';
import RuleComposer from './views/RuleComposer';
import RulesSection from './views/RulesSection';

function Automations() {
  return (
    <Box gap="l">
      <PageHeader title="Automations" description={AUTOMATIONS_PAGE_DESCRIPTION} />
      <RuleComposer />
      <RulesSection />
    </Box>
  );
}

export default Automations;
