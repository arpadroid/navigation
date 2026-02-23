import { ArpaElementConfigType } from '@arpadroid/ui';
import { AccordionConfigType } from '../accordion/accordion.types';

export type SideNavConfigType = ArpaElementConfigType & {
    collapsedClass?: string;
    accordion?: {
        enabled?: boolean;
        config?: AccordionConfigType;
    };
};
