import {ROOT_URL} from '@constants/avito';
import {createLogger} from '@utils/logger';
import {request} from '@utils/tor';
import {HTMLElement, parse} from 'node-html-parser';
import {getHref} from '@utils/html';
import {
  getCategoryInfoNodeSelector,
  getCurrentRubricatorSelector,
  getSubSelector,
  getTopRubricatorSelector,
} from './selectors';
import {getValidTimestamp} from './common';
import {get} from 'lodash';
import {DATA_MARKER, TITLE} from '@constants/attributes';
import {Category} from '@models/Category';

const logger = createLogger('Avito');

export const avitoRequest = async (link: string) => {
  logger.info('Making request to %s', link);
  const html = await request(link);
  const node = parse(html);
  return node;
};

export const makeAvitoLink = (path: string) => `${ROOT_URL}${path}`;

export const parseCategory = async (
  link: string,
  categories: Array<Category>
) => {
  if (!link) {
    return null;
  }
  const categoryPage = await avitoRequest(link);
  const rootNode = categoryPage.querySelector(getCurrentRubricatorSelector());
  const category = extractCategoryInfo(categories, rootNode);
  return category;
};

const extractCategoryInfo = (
  categories: Array<Category>,
  page: HTMLElement | null,
  parentCategory?: Avito.Category
): Avito.Category | null => {
  if (!page) {
    return null;
  }
  const infoNode = page.querySelector(getCategoryInfoNodeSelector());
  if (!infoNode) {
    return null;
  }
  const id = getCategoryId(infoNode);
  if (!id) {
    return null;
  }
  const category: Avito.Category = {
    id,
    title: getCategoryTitle(infoNode),
    link: getCategoryLink(infoNode),
    valid: getValidTimestamp(),
    parentId: parentCategory?.id,
    subs: [],
  };

  categories.push(Category.create(category));

  const subNodes = page.querySelectorAll(getSubSelector());

  // @ts-expect-error filter doesnt assert
  category.subs = subNodes
    .map(node => extractCategoryInfo(categories, node, category))
    .filter(category => category);

  return category;
};

const getCategoryId = (node: HTMLElement) => {
  const marker = get(node.attributes, DATA_MARKER);
  const match = marker.match(/(?<=\[).*?(?=\])/g);
  if (match) {
    const [id] = match;
    return Number(id);
  }
  return '';
};

const getCategoryLink = (node: HTMLElement) => makeAvitoLink(getHref(node));

const getCategoryTitle = (node: HTMLElement) => get(node.attributes, TITLE);

export const extractRootCategories = (node: HTMLElement) => {
  const categories = node.querySelectorAll(getTopRubricatorSelector());
  return categories.map(node => ({link: getCategoryLink(node)}));
};
