/**
 * @typedef {import('./navMenu.types').NavMenuConfigType} NavMenuConfigType
 */
import { mergeObjects, defineCustomElement } from '@arpadroid/tools';
import { List } from '@arpadroid/lists';
import NavLink from '../navLink/navLink';
class NavMenu extends List {
    /**
     * Returns default config.
     * @returns {NavMenuConfigType}
     */
    getDefaultConfig() {
        const defaultConfig = super.getDefaultConfig();
        /** @type {NavMenuConfigType} */
        const conf = {
            className: 'navMenu',
            hasResource: true,
            itemTag: 'nav-link',
            itemComponent: NavLink,
            tagName: 'nav-menu',
            controls: []
        };
        return mergeObjects(defaultConfig, conf);
    }
}

defineCustomElement('nav-menu', NavMenu);

export default NavMenu;
