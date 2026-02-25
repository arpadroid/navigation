import { ListConfigType } from '@arpadroid/lists';
import NavLink from '../navLink/navLink';

export type NavMenuConfigType = Partial<ListConfigType> & {
    itemComponent?: typeof NavLink;
};
