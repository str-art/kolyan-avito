export const getTopRubricatorSelector = () =>
  '[class*="outer"] [class*="rubricator"] a[href]';

export const getInnerRubricatorSelector = () =>
  '[data-marker^="category"]:has(> div > [data-marker$="current"]) > [data-marker$="subs"]';

export const getCurrentRubricatorSelector = () =>
  '[data-marker^="category"]:has(> div > [data-marker$="current"])';

export const getItemSelector = () =>
  '[data-marker*="catalog"] > [data-marker="item"][data-item-id][id]';

export const getCurrentCategoryNodeSelector = () => '[data-marker$="current"]';

export const getCategoryInfoNodeSelector = () => 'div > a';

export const getSubSelector = () => ':scope > [data-marker$="subs"] > li';
