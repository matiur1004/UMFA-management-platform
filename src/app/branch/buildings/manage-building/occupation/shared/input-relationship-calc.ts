import {CommonAreaShopRelationsViewModel} from './models';
import {
  CommonAreaLiabilityViewModel,
  CommonAreaViewModel,
  Dictionary,
  LiabilityViewModel,
  LiableShopStatus,
  ShopLiabilityViewModel,
  ShopViewModel,
  SplitType
} from '@models';

export class RelationshipDataCalculation {
  public static evaluate(commonAreas: Dictionary<CommonAreaViewModel>, shops: Dictionary<ShopViewModel>, commonAreaIds: string[], shopIds: string[], commonAreaLiabilities: CommonAreaLiabilityViewModel[]): CommonAreaShopRelationsViewModel[] {
    const result = new Array<CommonAreaShopRelationsViewModel>();

    const addedCommonAreaIds = new Array<string>();

    // Fetch all data whych have connection
    commonAreaLiabilities.forEach(cl => {
      if (cl.liabilities.length > 0) {
        const addedShopIds = new Array<string>();
        cl.liabilities[0].shopLiabilities.forEach(shop => {
          const status = new CommonAreaShopRelationsViewModel();
          status.commmonAreaId = cl.commonAreaId;
          status.shopId = shop.shopId;
          status.isSelected = true;
          result.push(status);
          addedShopIds.push(shop.shopId);
        });

        if (addedShopIds.length !== shopIds.length) {
          shopIds.forEach(shopId => {
            const addedShop = addedShopIds.find(addedShopId => addedShopId == shopId);
            if (!addedShop) {
              const status = new CommonAreaShopRelationsViewModel();
              status.commmonAreaId = cl.commonAreaId;
              status.shopId = shopId;
              status.isSelected = false;
              result.push(status);
            }
          });
        }

      } else {
        shopIds.forEach(shopId => {
          const status = new CommonAreaShopRelationsViewModel();
          status.commmonAreaId = cl.commonAreaId;
          status.shopId = shopId;
          status.isSelected = false;
          result.push(status);
        });
      }

      addedCommonAreaIds.push(cl.commonAreaId);
    });

    if (commonAreaIds.length != addedCommonAreaIds.length) {
      commonAreaIds.forEach(commonAreaId => {
        const addedCommonArea = addedCommonAreaIds.find(addedCommonAreaId => addedCommonAreaId == commonAreaId);
        if (!addedCommonArea) {
          shopIds.forEach(shopId => {
            const status = new CommonAreaShopRelationsViewModel();
            status.commmonAreaId = commonAreaId;
            status.shopId = shopId;
            status.isSelected = false;
            result.push(status);
          });
        }
      });
    }

    return result;
  }

  public static evaluateLiabilityForRelations(liability: LiabilityViewModel, shopData: CommonAreaShopRelationsViewModel[], serviceType: number, shops: Dictionary<ShopViewModel>) {

    if (liability.ownerLiable) {
      shopData.forEach(shop => {
        shop.liabilities.find(l => l.serviceType === serviceType).proportion = '0';
      });
    } else {

      const _liableShops = shopData.filter(s => {
        const liability = s.liabilities.find(l => l.serviceType === serviceType);
        if (liability && liability.status === LiableShopStatus.LiableShops) {
          return liability;
        }
      });
      const _notLiableShops = shopData.filter(s => {
        const liability = s.liabilities.find(l => l.serviceType === serviceType);
        if (liability && liability.status === LiableShopStatus.NotLiableShops) {
          return liability;
        }
      });
      const _vacantShops = shopData.filter(s => {
        const liability = s.liabilities.find(l => l.serviceType === serviceType);
        if (liability && liability.status === LiableShopStatus.VacantShops) {
          return liability;
        }
      });

      switch (liability.splitType) {
        case SplitType.Equal: {
          const liableShopCountinc = _liableShops.length;
          const notLiableShopCountinc = _notLiableShops.length;
          const vacantShopCountinc = _vacantShops.length;
          const counts = [liableShopCountinc, notLiableShopCountinc, vacantShopCountinc];

          RelationshipDataCalculation.eveluateEqual(liability.includeVacantShopSqM, liability.includeNotLiableShops,
            counts, shopData, (obj: CommonAreaShopRelationsViewModel, value) => {
              obj.liabilities.find(l => l.serviceType == serviceType).proportion = Number(value).toString();
            },
            (s) => s.liabilities.find(l => l.serviceType == serviceType).status);
        }
          break;

        case SplitType.Proportional: {
          let liableShopArea = 0;
          const liableShops = _liableShops;

          if (liableShops.length > 0) {
            liableShopArea = liableShops.map(a => {
              const shop = shops[a.shopId];
              return shop.area;
            }).reduce((sum, current) => {
              return sum + current;
            });
          }

          let notLiableShopArea = 0;
          const notLiableShops = _notLiableShops;

          if (notLiableShops.length > 0) {
            notLiableShopArea = notLiableShops.map(a => {
              const shop = shops[a.shopId];
              return shop.area;
            }).reduce((sum, current) => {
              return sum + current;
            });
          }

          let vacantShopArea = 0;
          const vacantShops = _vacantShops;

          if (vacantShops.length > 0) {
            vacantShopArea = vacantShops.map(a => {
              const shop = shops[a.shopId];
              return shop.area;
            }).reduce((sum, current) => {
              return sum + current;
            });
          }

          const areas: number[] = [liableShopArea, notLiableShopArea, vacantShopArea];

          RelationshipDataCalculation.eveluateProportional(liability.includeVacantShopSqM, liability.includeNotLiableShops,
            areas, shopData, (obj: CommonAreaShopRelationsViewModel, value) => {
              obj.liabilities.find(l => l.serviceType == serviceType).proportion = Number(value).toString();
            },
            (obj: CommonAreaShopRelationsViewModel) => shops[obj.shopId].area, (s) => s.liabilities.find(l => l.serviceType == serviceType).status);
        }
          break;

        case SplitType.Custom:
          let liableShopArea = 0;
          const liableShops = _liableShops;

          if (liableShops.length > 0) {
            liableShopArea = liableShops.map(a => {
              return a.liabilities.find(l => l.serviceType == serviceType).allocation;
            }).reduce((sum, current) => {
              return sum + current;
            });
          }

          let notLiableShopArea = 0;
          const notLiableShops = _notLiableShops;

          if (notLiableShops.length > 0) {
            notLiableShopArea = notLiableShops.map(a => {
              return a.liabilities.find(l => l.serviceType == serviceType).allocation;
            }).reduce((sum, current) => {
              return sum + current;
            });
          }

          let vacantShopArea = 0;
          const vacantShops = _vacantShops;

          if (vacantShops.length > 0) {
            vacantShopArea = vacantShops.map(a => {
              return a.liabilities.find(l => l.serviceType == serviceType).allocation;
            }).reduce((sum, current) => {
              return sum + current;
            });
          }

          const areas: number[] = [liableShopArea, notLiableShopArea, vacantShopArea];

          RelationshipDataCalculation.eveluateCustom(liability.includeVacantShopSqM, liability.includeNotLiableShops,
            areas, shopData, (obj: CommonAreaShopRelationsViewModel, value) => {
              obj.liabilities.find(l => l.serviceType == serviceType).proportion = Number(value).toString();
            },
            (obj: CommonAreaShopRelationsViewModel) => obj.liabilities.find(l => l.serviceType == serviceType).allocation, (s) => s.liabilities.find(l => l.serviceType == serviceType).status);
          break;

        default:
          break;
      }
    }
  }

  public static evaluateLiability(liability: LiabilityViewModel, shops: Dictionary<ShopViewModel>) {

    if (liability.ownerLiable) {
      liability.shopLiabilities.forEach(shopLiability => {
        shopLiability.proportion = '0';
      });
    } else {

      const _liableShops = liability.shopLiabilities.filter(f => f.status == LiableShopStatus.LiableShops);
      const _notLiableShops = liability.shopLiabilities.filter(f => f.status == LiableShopStatus.NotLiableShops);
      const _vacantShops = liability.shopLiabilities.filter(f => f.status == LiableShopStatus.VacantShops);

      switch (liability.splitType) {
        case SplitType.Equal: {
          const liableShopCountinc = _liableShops.length;
          const notLiableShopCountinc = _notLiableShops.length;
          const vacantShopCountinc = _vacantShops.length;
          const count = [liableShopCountinc, notLiableShopCountinc, vacantShopCountinc];

          RelationshipDataCalculation.eveluateEqual(liability.includeVacantShopSqM, liability.includeNotLiableShops,
            count, liability.shopLiabilities, (obj, value) => {
              obj.proportion = value;
            },
            (obj: ShopLiabilityViewModel) => obj.status);
        }
          break;

        case SplitType.Proportional: {
          let liableShopArea = 0;
          const liableShops = _liableShops.map(a => {
            const shop = shops[a.shopId];
            return shop.area;
          });

          if (liableShops.length > 0) {
            liableShopArea = liableShops.reduce((sum, current) => {
              return sum + current;
            });
          }

          let notLiableShopArea = 0;
          const notLiableShops = _notLiableShops.map(a => {
            const shop = shops[a.shopId];
            return shop.area;
          });

          if (notLiableShops.length > 0) {
            notLiableShopArea = notLiableShops.reduce((sum, current) => {
              return sum + current;
            });
          }

          let vacantShopArea = 0;
          const vacantShops = _vacantShops.map(a => {
            const shop = shops[a.shopId];
            return shop.area;
          });

          if (vacantShops.length > 0) {
            vacantShopArea = vacantShops.reduce((sum, current) => {
              return sum + current;
            });
          }

          const areas: number[] = [liableShopArea, notLiableShopArea, vacantShopArea];
          RelationshipDataCalculation.eveluateProportional(liability.includeVacantShopSqM, liability.includeNotLiableShops,
            areas, liability.shopLiabilities, (obj, value) => {
              obj.proportion = value;
            },
            (obj: any) => obj.shop.area, (obj: ShopLiabilityViewModel) => obj.status);
        }
          break;

        case SplitType.Custom: {
          let liableShopAllocation = 0;
          const liableShops = _liableShops;
          if (liableShops.length > 0) {
            liableShopAllocation = liableShops.map(a => a.allocation)
              .reduce((sum, current) => {
                return sum + current;
              });
          }

          let notLiableShopAllocation = 0;
          const notLiableShops = _notLiableShops;
          if (notLiableShops.length > 0) {
            notLiableShopAllocation = notLiableShops.map(a => a.allocation).reduce((sum, current) => {
              return sum + current;
            });
          }

          let vacantShopAllocation = 0;
          const vacantShops = _vacantShops;
          if (vacantShops.length > 0) {
            vacantShopAllocation = vacantShops.map(a => a.allocation)
              .reduce((sum, current) => {
                return sum + current;
              });
          }

          const allocations: number[] = [liableShopAllocation, notLiableShopAllocation, vacantShopAllocation];
          RelationshipDataCalculation.eveluateCustom(liability.includeVacantShopSqM, liability.includeNotLiableShops,
            allocations, liability.shopLiabilities, (obj, value) => {
              obj.proportion = value;
            },
            (obj: any) => obj.allocation, (obj: ShopLiabilityViewModel) => obj.status);
        }
          break;

        default:
          break;
      }
    }
  }

  private static eveluateEqual(includeVacantShops, includeNotLiableShops, [liableShopCountinc, notLiableShopCountinc, vacantShopCountinc]: number[],
                               items: any[], updateFn: (obj: any, value) => void, getStatusFn: (obj: any) => LiableShopStatus) {

    let totalCount = liableShopCountinc;
    if (includeVacantShops) {
      totalCount += vacantShopCountinc;
    }

    if (includeNotLiableShops) {
      totalCount += notLiableShopCountinc;
    }

    items.forEach(item => {
      let calc = '0';

      if (getStatusFn(item) == LiableShopStatus.LiableShops && totalCount) {
        calc = Number(100 / totalCount).toFixed(2);
      }

      if (getStatusFn(item) == LiableShopStatus.NotLiableShops && totalCount) {
        calc = Number(includeNotLiableShops ? 100 / totalCount : 0.00).toFixed(2);
      }

      if (getStatusFn(item) == LiableShopStatus.VacantShops && totalCount) {
        calc = Number(includeVacantShops ? 100 / totalCount : 0.00).toFixed(2);
      }

      updateFn(item, calc);
    });

  }

  private static eveluateProportional(includeVacantShops, includeNotLiableShops, [liableShopArea, notLiableShopArea,
                                        vacantShopArea]: number[], items: any[], updateFn: (obj: any, value) => void,
                                      getAreaFn: (obj: any) => number, getStatusFn: (obj: any) => LiableShopStatus) {

    let totalArea = liableShopArea;
    if (includeVacantShops) {
      totalArea += vacantShopArea;
    }

    if (includeNotLiableShops) {
      totalArea += notLiableShopArea;
    }

    items.forEach(item => {
      let calc = '0';

      if (getStatusFn(item) == LiableShopStatus.LiableShops && totalArea) {
        calc = Number(getAreaFn(item) / totalArea * 100).toFixed(2);
      }

      if (getStatusFn(item) == LiableShopStatus.NotLiableShops && totalArea) {
        calc = Number(includeNotLiableShops ? getAreaFn(item) / totalArea * 100 : 0.00).toFixed(2);
      }

      if (getStatusFn(item) == LiableShopStatus.VacantShops && totalArea) {
        calc = Number(includeVacantShops ? getAreaFn(item) / totalArea * 100 : 0.00).toFixed(2);
      }

      updateFn(item, calc);
    });

  }

  private static eveluateCustom(includeVacantShops, includeNotLiableShops, [liableShopAllocation, notLiableShopAllocation, vacantShopAllocation]: number[],
                                items: any[], updateFn: (obj: any, value) => void,
                                getAllocationFn: (obj: any) => number, getStatusFn: (obj: any) => LiableShopStatus) {

    let totalAllocation = liableShopAllocation;
    if (includeVacantShops) {
      totalAllocation += vacantShopAllocation;
    }

    if (includeNotLiableShops) {
      totalAllocation += notLiableShopAllocation;
    }

    items.forEach(item => {
      let calc = '0';

      if (getStatusFn(item) == LiableShopStatus.LiableShops && totalAllocation) {
        calc = Number(getAllocationFn(item) / totalAllocation * 100).toFixed(2);
      }

      if (getStatusFn(item) == LiableShopStatus.NotLiableShops && totalAllocation) {
        calc = Number(includeNotLiableShops ? getAllocationFn(item) / totalAllocation * 100 : 0.00).toFixed(2);
      }


      if (getStatusFn(item) == LiableShopStatus.VacantShops && totalAllocation) {
        calc = Number(includeVacantShops ? getAllocationFn(item) / totalAllocation * 100 : 0.00).toFixed(2);
      }

      updateFn(item, calc);
    });
  }
}
