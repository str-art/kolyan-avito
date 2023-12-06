import {HTMLElement} from 'node-html-parser';
import {HREF} from '@constants/attributes';
import {get} from 'lodash';

export const getHref = (node: HTMLElement) => {
  return get(node?.attributes, HREF, '');
};
