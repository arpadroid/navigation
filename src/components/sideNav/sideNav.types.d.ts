import { ArpaElementConfigType } from '@arpadroid/ui';
import { AccordionConfigType } from '@arpadroid/ui';

export type SideNavConfigType = ArpaElementConfigType & {
    collapsedClass?: string;
    accordion?: {
        enabled?: boolean;
        config?: AccordionConfigType;
    };
};
