import { ListItemConfigType } from '@arpadroid/lists';
import type { Router } from './navLink.js';
export type NavLinkConfigType = ListItemConfigType & {
    url?: string;
    action?: () => void;
    selected?: boolean;
    handlerAttributes?: Record<string, string | number | boolean>;
    router?: Router;
    tooltipPosition?: 'top' | 'bottom' | 'left' | 'right';
    tooltip?: string;
    divider?: string;
};
