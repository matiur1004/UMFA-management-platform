import {
  EquipmentAttributeViewModel,
  RelationshipModel,
  TariffCategoryGroupViewModel,
  TariffCategoryRuleViewModel,
  TariffCategoryViewModel,
  TariffRuleGroupsViewModel
} from '@models';
import {combineReducers} from '@ngrx/store';
import {
  addArrayControl,
  createFormGroupState,
  disable,
  enable,
  FormGroupState,
  formStateReducer,
  removeArrayControl,
  setValue,
  updateArray,
  updateArrayWithFilter,
  updateGroup,
  validate
} from 'ngrx-forms';
import {required} from 'ngrx-forms/validation';

import * as tariffCategoriesActions from '../actions/tariff-categories.actions';

export const CategoriesDefaultState = {
  id: '',
  categoriesEnabled: false,
  categories: []
};

const updateGroups = (
  state: FormGroupState<CategoriesFormValue>,
  categoryId: string,
  cb: Function
) => {
  return updateGroup<CategoriesFormValue>({
    categories: updateArrayWithFilter<TariffCategoryViewModel>(
      (s, idx) => s.value.id === categoryId,
      (categoriesForm) =>
        updateGroup<TariffCategoryViewModel>({
          ruleGroups: updateGroup<TariffRuleGroupsViewModel>({
            groups: (groupsForm) => cb(groupsForm)
          })
        })(categoriesForm))
  })(state);
};

const updateRules = (
  state: FormGroupState<CategoriesFormValue>,
  categoryId: string,
  groupId: string,
  cb: Function
) => {
  return updateGroup<CategoriesFormValue>({
    categories: updateArrayWithFilter<TariffCategoryViewModel>(
      (s, idx) => s.value.id === categoryId,
      (categoriesForm) =>
        updateGroup<TariffCategoryViewModel>({
          ruleGroups: updateGroup<TariffRuleGroupsViewModel>({
            groups: updateArrayWithFilter<TariffCategoryGroupViewModel>(
              (s, idx) => s.value.id === groupId,
              (groupsForm) =>
                updateGroup<TariffCategoryGroupViewModel>({
                  rules: rulesForm => cb(rulesForm)
                })(groupsForm)
            )
          })
        })(categoriesForm))
  })(state);
};

const updateGroupRelationship = (
  state: FormGroupState<CategoriesFormValue>,
  categoryId: string,
  groupId: string,
  cb: Function
) => {
  return updateGroup<CategoriesFormValue>({
    categories: updateArrayWithFilter<TariffCategoryViewModel>(
      (s, idx) => s.value.id === categoryId,
      (categoriesForm) =>
        updateGroup<TariffCategoryViewModel>({
          ruleGroups: updateGroup<TariffRuleGroupsViewModel>({
            groupRelationships: cb()
          })
        })(categoriesForm))
  })(state);
};

const updateRuleRelationship = (
  state: FormGroupState<CategoriesFormValue>,
  categoryId: string,
  groupId: string,
  ruleId: string,
  cb: Function
) => {
  return updateGroup<CategoriesFormValue>({
    categories: updateArrayWithFilter<TariffCategoryViewModel>(
      (s, idx) => s.value.id === categoryId,
      (categoriesForm) =>
        updateGroup<TariffCategoryViewModel>({
          ruleGroups: updateGroup<TariffRuleGroupsViewModel>({
            groups: updateArrayWithFilter<TariffCategoryGroupViewModel>(
              (s, idx) => s.value.id === groupId,
              (groupsForm) =>
                updateGroup<TariffCategoryGroupViewModel>({
                  ruleRelationships: cb()
                })(groupsForm)
            )
          })
        })(categoriesForm))
  })(state);
};

const getCategoryByID = (
  state: CategoriesFormValue,
  id: string
): TariffRuleGroupsViewModel => state.categories.find(c => c.id === id).ruleGroups;

const getGroupByID = (
  ruleGroups: TariffRuleGroupsViewModel,
  id: string
) => ruleGroups.groups.find(c => c.id === id);

const setNewRelationship = <T>(
  relationships: RelationshipModel[],
  bundle: T[] | any
): RelationshipModel[] => relationships.map((r, i) => {
  r.firstId = bundle[i] ? bundle[i].id : null;
  r.secondId = bundle[i + 1] ? bundle[i + 1].id : null;
  return (r.firstId && r.secondId) ? r : new RelationshipModel();
});

export interface CategoriesFormValue {
  id: string;
  categoriesEnabled: boolean;
  categories: TariffCategoryViewModel[];
}


export interface State {
  formState: FormGroupState<CategoriesFormValue>;
  attributes: EquipmentAttributeViewModel[];
}

export const validateAndUpdateForm = updateGroup<CategoriesFormValue>({
  categories: (s, parent) => {
    if (parent.value.categoriesEnabled !== s.isEnabled) {
      s = parent.value.categoriesEnabled ? enable(s) : disable(s);
    }

    return updateArray<TariffCategoryViewModel>(updateGroup<TariffCategoryViewModel>({
      name: validate(required),
      supplyType: validate(required),
      ruleGroups: updateGroup<TariffRuleGroupsViewModel>({
        groups: updateArray<TariffCategoryGroupViewModel>(
          updateGroup<TariffCategoryGroupViewModel>({
            rules: updateArray<TariffCategoryRuleViewModel>(
              updateGroup<TariffCategoryRuleViewModel>({
                value: validate(required),
                attributeId: validate(required),
                comparisonOperator: validate(required)
              })
            )
          })
        )
      })
    }))(s);
  }
});

export const getReducer = (formId) => {
  const initState = createFormGroupState<CategoriesFormValue>(formId,
    {
      ...CategoriesDefaultState
    });

  return combineReducers<State, any>({
    formState(state = initState, a: tariffCategoriesActions.Action) {
      state = formStateReducer(state, a);
      switch (a.type) {
        case tariffCategoriesActions.TARIFF_CATEGORY_ADD_NEW_CATEGORY: {
          const newModels = a.payload as TariffCategoryViewModel[];
          state = updateGroup<CategoriesFormValue>({
            categories: (categoriesForms) => {
              let result = categoriesForms;

              for (const model of newModels) {
                result = addArrayControl(model)(result)
              }

              return result;
            }
          })(state);

          break;
        }

        case tariffCategoriesActions.TARIFF_CATEGORY_DELETE_CATEGORY: {
          state = updateGroup<CategoriesFormValue>({
            categories: categoriesForms => {
              return removeArrayControl(a.payload)(categoriesForms);
            }
          })(state);
          break;
        }
        case tariffCategoriesActions.TARIFF_CATEGORY_CHANGE_SUPPLY_TYPE: {
          const {categoryId, supplyType} = a.payload;
          state = updateGroup<CategoriesFormValue>({
            categories: categoriesForms => {
              return updateArrayWithFilter<TariffCategoryViewModel>(
                c => c.value.id === categoryId,
                categoryForm => updateGroup<TariffCategoryViewModel>({
                  supplyType: (s) => setValue(supplyType)(s)
                })(categoryForm))(categoriesForms);
            }
          })(state);
          break;
        }
        case tariffCategoriesActions.TARIFF_CATEGORY_RESET_RULE: {
          const {categoryId} = a.payload;
          state = updateGroup<CategoriesFormValue>({
            categories: categoriesForms => {
              return updateArrayWithFilter<TariffCategoryViewModel>(
                c => c.value.id === categoryId,
                categoryForm => updateGroup<TariffCategoryViewModel>({
                  ruleGroups: (s) => setValue(new TariffRuleGroupsViewModel())(s)
                })(categoryForm))(categoriesForms);
            }
          })(state);
          break;
        }
        case tariffCategoriesActions.TARIFF_CATEGORY_ADD_NEW_GROUP: {
          const {categoryId, groupId} = a.payload;
          const ruleGroups = getCategoryByID(state.value, categoryId);
          const beforeGroupIndex = ruleGroups.groups.findIndex(g => g.id === groupId);
          const newGroup = new TariffCategoryGroupViewModel();

          state = updateGroups(
            state,
            categoryId,
            (groupsForm) => addArrayControl(newGroup, beforeGroupIndex + 1)(groupsForm)
          );

          // Set relationships
          const relationshipIndex = ruleGroups.groupRelationships.findIndex(c => c.secondId === groupId);
          const newCategory = getCategoryByID(state.value, categoryId);
          let newRelationships = [...ruleGroups.groupRelationships];

          newRelationships.splice(relationshipIndex + 1, 0, new RelationshipModel());
          newRelationships = setNewRelationship<TariffCategoryGroupViewModel[]>(newRelationships, newCategory.groups);

          state = updateGroupRelationship(
            state,
            categoryId,
            groupId,
            () => gcForm => setValue(newRelationships)(gcForm)
          );
          break;
        }

        case tariffCategoriesActions.TARIFF_CATEGORY_SET_GROUP_LOGICAL_OPERATOR: {
          const {categoryId, groupId, operator} = a.payload;
          const groupRelationships = getCategoryByID(state.value, categoryId).groupRelationships;
          const newCondition = groupRelationships.find(c => c.secondId === groupId);

          newCondition.logicalOperator = operator;

          state = updateGroupRelationship(
            state,
            categoryId,
            groupId,
            () => updateArrayWithFilter<RelationshipModel>(
              (s, idx) => s.value.secondId === groupId,
              (relationshipForm) => updateGroup<RelationshipModel>({
                logicalOperator: (s) => setValue(operator)(s)
              })(relationshipForm)
            )
          );
          break;
        }

        case tariffCategoriesActions.TARIFF_CATEGORY_ADD_NEW_RULE: {
          const {categoryId, groupId, ruleId} = a.payload;
          const ruleGroups = getCategoryByID(state.value, categoryId);
          const group = getGroupByID(ruleGroups, groupId);
          const ruleIndex = group.rules.findIndex(g => g.id === ruleId);

          state = updateRules(
            state,
            categoryId,
            groupId,
            (rulesForm) => addArrayControl(new TariffCategoryRuleViewModel(), ruleIndex + 1)(rulesForm)
          );

          // Set condition
          const newCategory = getCategoryByID(state.value, categoryId);
          const newGroup = getGroupByID(newCategory, groupId);
          const relationshipIndex =
            (group.rules.length - 1 === ruleIndex)
              ? newGroup.ruleRelationships.findIndex(c => c.secondId === ruleId) + 1
              : newGroup.ruleRelationships.findIndex(c => c.firstId === ruleId);

          let newRelationships = [...newGroup.ruleRelationships];

          newRelationships.splice(relationshipIndex, 0, new RelationshipModel());
          newRelationships = setNewRelationship<TariffCategoryGroupViewModel[]>(newRelationships, newGroup.rules);

          state = updateRuleRelationship(
            state,
            categoryId,
            groupId,
            ruleId,
            () => rcForm => setValue(newRelationships)(rcForm)
          );
          break;
        }

        case tariffCategoriesActions.TARIFF_CATEGORY_DELETE_RULE: {
          const {categoryId, groupId, ruleId} = a.payload;
          const category = getCategoryByID(state.value, categoryId);
          const group = getGroupByID(category, groupId);
          const groupIndex = category.groups.findIndex(g => g.id === groupId);
          const ruleIndex = group.rules.findIndex(g => g.id === ruleId);

          if (group.rules.length === 1) {
            // delete group
            state = updateGroups(
              state,
              categoryId,
              (groupsForm) => removeArrayControl(groupIndex)(groupsForm)
            );

            // Update relationships
            const newCategory = getCategoryByID(state.value, categoryId);
            let newRelationships =
              ruleIndex > 0
                ? category.groupRelationships.filter(c => c.secondId !== groupId)
                : category.groupRelationships.filter(c => c.firstId !== groupId);

            newRelationships =
              newCategory.groups.length > 1
                ? setNewRelationship<TariffCategoryRuleViewModel[]>(newRelationships, newCategory.groups)
                : [];

            state = updateGroupRelationship(
              state,
              categoryId,
              groupId,
              () => gcForm => setValue(newRelationships)(gcForm)
            );

          } else {
            // delete rule
            state = updateRules(
              state,
              categoryId,
              groupId,
              (rulesForm) => removeArrayControl(ruleIndex)(rulesForm)
            );

            // Update relationship
            const newCategory = getCategoryByID(state.value, categoryId);
            const newGroup = getGroupByID(newCategory, groupId);
            let newRelationships =
              ruleIndex > 0
                ? newGroup.ruleRelationships.filter(c => c.secondId !== ruleId)
                : newGroup.ruleRelationships.filter(c => c.firstId !== ruleId);

            newRelationships =
              newGroup.rules.length > 1
                ? setNewRelationship<TariffCategoryRuleViewModel[]>(newRelationships, newGroup.rules)
                : [];

            state = updateRuleRelationship(
              state,
              categoryId,
              groupId,
              ruleId,
              () => rcForm => setValue(newRelationships)(rcForm)
            );
          }
          break;
        }

        case tariffCategoriesActions.TARIFF_CATEGORY_SET_RULE_LOGICAL_OPERATOR: {
          const {categoryId, groupId, ruleId, operator} = a.payload;
          const category = getCategoryByID(state.value, categoryId);
          const ruleRelationships = getGroupByID(category, groupId).ruleRelationships;
          const newRelationship = ruleRelationships.find(c => c.secondId === ruleId);
          newRelationship.logicalOperator = operator;

          state = updateRuleRelationship(
            state,
            categoryId,
            groupId,
            ruleId,
            () => updateArrayWithFilter<RelationshipModel>(
              (s, idx) => s.value.secondId === ruleId,
              (relationshipForm) => updateGroup<RelationshipModel>({
                logicalOperator: (s) => setValue(operator)(s)
              })(relationshipForm)
            )
          );

          break;
        }

        case tariffCategoriesActions.TARIFF_CATEGORY_CHANGE_RULE: {
          const {categoryId, groupId, rule} = a.payload;

          state = updateRules(
            state,
            categoryId,
            groupId,
            (rulesForm) => updateArrayWithFilter<TariffCategoryRuleViewModel>(
              (s, idx) => s.value.id === rule.id,
              (ruleFrom) => updateGroup<TariffCategoryRuleViewModel>({
                attributeId: (s) => setValue(rule.attributeId)(s),
                comparisonOperator: (s) => setValue(rule.comparisonOperator)(s),
                value: (s) => setValue(rule.value)(s)
              })(ruleFrom)
            )(rulesForm)
          );

          break;

        }
        default:
          return state;
      }
      return validateAndUpdateForm(state);
    },
    attributes(state = null, a: tariffCategoriesActions.Action) {
      switch (a.type) {
        case tariffCategoriesActions.API_GET_EQUIPMENT_ATTRIBUTES_SUCCEEDED:
          return a.payload;
        default:
          return state;
      }
    }
  });
};

export const getFormState = (state: State) => state.formState;
