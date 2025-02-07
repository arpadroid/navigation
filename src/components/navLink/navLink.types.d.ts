import { ListItemConfigType } from '@arpadroid/lists/src/components/listItem/listItem.types';
import { Router } from './navLink';
export type NavLinkConfigType = ListItemConfigType & {
    url?: string;
    action?: () => void;
    selected?: boolean;
    handlerAttributes?: Record<string, string | number | boolean>;
    router?: Router;
    divider?: string;
};
