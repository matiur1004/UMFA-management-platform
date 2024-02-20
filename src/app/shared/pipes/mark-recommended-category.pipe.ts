import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'markRecommendedCategory'
})
export class MarkRecommendedCategoryPipe implements PipeTransform {

  transform(categories: any[], recomendedCategories: any[], tariffId: string): any {
    let res = [];

    if (Array.isArray(categories) && Array.isArray(recomendedCategories) && tariffId) {
      const categoryForTariff = recomendedCategories.find(el => el.tariffVerionId === tariffId);
      if (categoryForTariff) {
        categories.forEach(category => {
          res.push({
            ...category,
            isRecommended: categoryForTariff.applicableLineItemsCategories.indexOf(category.id) !== -1
          });
        });
      } else {
        res = categories;
      }
      res = res.sort((a, b) => {
        if (!a.isRecommended && b.isRecommended) {
          return 1;
        }
        if (a.isRecommended && !b.isRecommended) {
          return -1;
        }
        if (a.name > b.name) {
          return 1;
        }
        if (a.name <= b.name) {
          return -1;
        }
        return 0;
      });
    }

    return res;
  }
}
