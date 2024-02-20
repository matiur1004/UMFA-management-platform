import {Config, Request} from '../config';
import {Response} from '../help/response.interface';

describe('Buildings api', () => {
  it("GET branches/categories", (done) => {
    const url = '/api/v1/branches/categories';
    Request.get(url).end((err, res: Response) => {

      expect(res.status).toBe(200);

      const categories = res.body.data;
      expect(categories.length).not.toEqual(0);
      const testCategory = categories.find(el => el.id === Config.category.id);
      expect(testCategory.name).toEqual(Config.category.name);

      done();

    });
  });

  it('GET buildings', (done) => {
    const url = '/api/v1/buildings';
    Request.get(url).end((err, res: Response) => {

      expect(res.status).toBe(200);

      const buildings = res.body.data.items;
      expect(buildings.length).not.toEqual(0);
      const testBuilding = buildings.find(el => el.id === Config.building.id);
      expect(testBuilding.name).toEqual(Config.building.name);

      done();

    });
  });

});
