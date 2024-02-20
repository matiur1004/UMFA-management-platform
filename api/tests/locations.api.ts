import {Config, Request} from '../config';
import {Response} from '../help/response.interface';

describe('Locations api', () => {
  it('GET buildings/{buildingId}/locations', (done) => {
    const url = `/api/v1/buildings/${Config.building.id}/locations`;
    Request.get(url).end((err, res: Response) => {

      expect(res.status).toBe(200);
      done();

    });
  });

});
