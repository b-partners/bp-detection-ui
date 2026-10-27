import { analyseRoof } from './roof-analysis';

const address = '12 Boulevard de la Croisette, 06400 Cannes';

describe('Roof analysis on ' + address, () => {
  it('runs the analysis through to the report and the acknowledgement', () => analyseRoof(address));
});
