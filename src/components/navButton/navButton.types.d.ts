import { ButtonConfigType } from '@arpadroid/ui';

export type NavButtonConfigType = ButtonConfigType & {
    closeOnClick?: boolean;
    closeOnBlur?: boolean;
    hasTabIndex?: boolean;
    icon?: string;
    links?: NavLinkConfigType[];
    tooltip?: string;
    menuPosition?: 'left' | 'right' | 'top' | 'bottom';
    navClass?: string;
    inputComboConfig?: InputComboConfigType;
    navType?: 'combo' | 'accordion' | 'none';
};
