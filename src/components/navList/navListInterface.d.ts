
import { NavLinkInterface } from '../navLink/navLinkInterface.js';

export interface NavListInterface extends ListInterface {
    variant?: 'horizontal' | 'vertical';
    divider?: string;
    links?: NavLinkInterface[];
}
