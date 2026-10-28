import { analyseRoof } from './roof-analysis';

const address = '1 Rue de la Vau Saint-Jacques, 79200 Parthenay';

describe('Roof analysis on ' + address, () => {
  it('runs the analysis through to the report and the acknowledgement', () => analyseRoof(address));
});
