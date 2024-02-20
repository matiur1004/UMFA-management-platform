import {Config, Request} from '../config';
import {Response} from '../help/response.interface';

describe('Equipments api', () => {
  it('GET buildings/{buildingId}/meter-list', (done) => {
    const url = `/api/v1/buildings/${Config.building.id}/meter-list`;
    Request.get(url).end((err, res: Response) => {

      expect(res.status).toBe(200);
      done();

    });
  });

});
