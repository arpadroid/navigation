import { ListItemInterface } from '../../types.compiled';

export interface NavLinkInterface extends ListItemInterface {
    url?: string;
    action?: () => void;
}
