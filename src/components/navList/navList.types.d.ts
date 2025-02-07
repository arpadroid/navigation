import { ListConfigType } from '@arpadroid/lists/src/components/list/list.types';
import { NavLinkConfigType } from '../navLink/navLink.types';
import NavLink from '../navLink/navLink';

export type NavListConfigType = Omit<ListConfigType, 'itemComponent'> & {
    variant?: 'horizontal' | 'vertical' | 'default';
    divider?: string;
    links?: NavLinkConfigType[];
    itemComponent?: typeof NavLink;
    isItemSelected?: (payload: SelectedCallbackPayloadType) => boolean;
};

export type SelectedCallbackPayloadType = {
    node?: HTMLElement;
    linkNode?: HTMLAnchorElement | HTMLButtonElement;
    paramName?: string;
    paramValue?: string;
    currentParam?: string;
};
