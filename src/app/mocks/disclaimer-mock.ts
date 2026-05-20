import { DisclaimerType } from '@c_types/means-graph.type';
import { DisclaimerInfo } from '@interfaces/graph-config.interface';

export const exampleDisclaimer = (overrides: Partial<DisclaimerInfo> = {}): DisclaimerInfo => ({
  title: 'Test Title',
  description: 'Test description',
  type: 'info' as DisclaimerType,
  icon: 'info',
  isAccordion: true,
  isOpen: false,
  ...overrides,
});
