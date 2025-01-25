/**
 * @typedef {import('./navigationInterface.js').NavigationInterface} NavigationInterface
 */
import { mergeObjects, observerMixin, dummySignal } from '@arpadroid/tools';
import NavLink from '../navLink/navLink.js';
import { List } from '@arpadroid/lists';

class NavList extends List {
    _initialize() {
        observerMixin(this);
        this.signal = dummySignal;
        super._initialize();
    }
    /**
     * Default component config.
     * @returns {NavigationInterface}
     */
    getDefaultConfig() {
        return mergeObjects(super.getDefaultConfig(), {
            className: 'navList',
            hasResource: false,
            divider: undefined,
            links: [],
            variant: '',
            renderMode: 'minimal',
            isItemSelected: undefined,
            itemComponent: NavLink
        });
    }

    _initializeNodes() {
        this.itemsNode.setAttribute('role', 'navigation');
    }

    onSelected(link) {
        this.signal('selected', link);
    }
}

customElements.define('nav-list', NavList);

export default NavList;
