import { analyseRoof } from './roof-analysis';

const address = '16 Rue Rameau, 21000 Dijon';

describe('Roof analysis on ' + address, () => {
  it('runs the analysis through to the report and the acknowledgement', () => analyseRoof(address));
});
