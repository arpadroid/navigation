/**
 * @typedef {import('./navigationInterface.js').NavigationInterface} NavigationInterface
 */
import { mergeObjects } from '@arpadroid/tools';
import NavLink from '../navLink/navLink.js';
import { List } from '@arpadroid/lists';

class NavList extends List {
    /**
     * Default component config.
     * @returns {NavigationInterface}
     */
    getDefaultConfig() {
        return mergeObjects(super.getDefaultConfig(), {
            className: 'navList',
            divider: undefined,
            links: [],
            variant: '',
            renderMode: 'minimal',
            itemComponent: NavLink
        });
    }

    setLinks(links) {
        this._config.links = links;
    }

    _onConnected() {
        super._onConnected();
        this.addItems(this._config.links);
        this._config.links = [];
        this.itemsNode.setAttribute('role', 'navigation');
    }
}

customElements.define('nav-list', NavList);

export default NavList;
