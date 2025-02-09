import { ArpaElementConfigType, InputComboConfigType } from '@arpadroid/ui';
import { NavLinkConfigType } from '../navLink/navLink.types';

export type IconMenuConfigType = ArpaElementConfigType & {
    closeOnClick?: boolean;
    closeOnBlur?: boolean;
    hasTabIndex?: boolean;
    icon?: string;
    links?: NavLinkConfigType[];
    tooltip?: string;
    menuPosition?: 'left' | 'right' | 'top' | 'bottom';
    navClass?: string;
    inputComboConfig?: InputComboConfigType;
};
