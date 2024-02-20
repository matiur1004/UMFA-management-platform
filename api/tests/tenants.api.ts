import {Config, Request} from '../config';
import {Response} from '../help/response.interface';

describe('Tenants api', () => {
  it('GET buildings/{buildingId}/tenants', (done) => {
    const url = `/api/v1/buildings/${Config.building.id}/tenants`;
    Request.get(url).end((err, res: Response) => {

      expect(res.status).toBe(200);
      done();

    });
  });

});
