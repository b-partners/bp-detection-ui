import { analyseRoof } from './roof-analysis';

const address = '13 Rue Honoré Daumier, 56000 Vannes';

describe('Roof analysis on ' + address, () => {
  it('runs the analysis through to the report and the acknowledgement', () => analyseRoof(address));
});
