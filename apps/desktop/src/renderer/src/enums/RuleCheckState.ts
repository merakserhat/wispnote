import {
  AlertCircleIcon,
  AlertTriangleIcon,
  CheckCircleIcon,
  Loading01Icon,
  SlashCircle01Icon,
  TIconComponent,
} from 'components/Icons';

import { TThemePrimitiveKey } from 'theme/theme.types';

enum RuleCheckState {
  CHECKING = 'CHECKING',
  READY = 'READY',
  NEEDS_GROUP = 'NEEDS_GROUP',
  NEEDS_REWORDING = 'NEEDS_REWORDING',
  COULDNT_CHECK = 'COULDNT_CHECK',
}

const MAP: Record<RuleCheckState, { icon: TIconComponent; color: TThemePrimitiveKey }> = {
  [RuleCheckState.CHECKING]: { icon: Loading01Icon, color: 'textTertiary' },
  [RuleCheckState.READY]: { icon: CheckCircleIcon, color: 'statusPositivePrimary' },
  [RuleCheckState.NEEDS_GROUP]: { icon: AlertTriangleIcon, color: 'statusWarningPrimary' },
  [RuleCheckState.NEEDS_REWORDING]: { icon: AlertCircleIcon, color: 'statusErrorPrimary' },
  [RuleCheckState.COULDNT_CHECK]: { icon: SlashCircle01Icon, color: 'textTertiary' },
};

export function getIconByRuleCheckState(state: RuleCheckState) {
  return MAP[state].icon;
}

export function getColorByRuleCheckState(state: RuleCheckState) {
  return MAP[state].color;
}

export default RuleCheckState;
