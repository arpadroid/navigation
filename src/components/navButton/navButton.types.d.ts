import { ButtonConfigType } from '@arpadroid/ui';
import { NavLinkConfigType } from '../navLink/navLink.types';
import { InputComboConfigType } from '@arpadroid/ui';

export type NavButtonConfigType = ButtonConfigType & {
    id?: string;
    closeOnClick?: boolean;
    closeOnBlur?: boolean;
    hasTabIndex?: boolean;
    icon?: string;
    popover?: 'auto' | 'manual' | 'hint' | false | 'false';
    links?: NavLinkConfigType[];
    tooltip?: string;
    menuPosition?: 'left' | 'right' | 'top' | 'bottom' | 'false' | 'bottom-right';
    navClass?: string;
    inputComboConfig?: InputComboConfigType;
    navType?: 'combo' | 'accordion' | 'none';
};
