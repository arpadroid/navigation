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
            listSelector: 'nav-menu',
            templateTypes: ['content', 'list-item'],
            controls: []
        };
        return mergeObjects(defaultConfig, conf);
    }

    _initializeContent() {
        super._initializeContent();
        this.navButtons = this.querySelectorAll('nav-button');
        // this.links = this.querySelectorAll('nav-link');
        // this.linksFrag = document.createDocumentFragment();
        // this.linksFrag.append(...this.links);
    }

    /**
     * Pre-processes a nav link node.
     * @param {NavLink} link - The nav link to process.
     */
    preProcessNavLink(link) {
        console.log('Pre-processing nav link:', link);
        // Implement any pre-processing logic for the nav link here.
    }
}

defineCustomElement('nav-menu', NavMenu);

export default NavMenu;
