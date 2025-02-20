/**
 * @typedef {import('./navList.types').NavListConfigType} NavListConfigType
 */
import { mergeObjects } from '@arpadroid/tools';
import { observerMixin, dummySignal, dummyListener, defineCustomElement } from '@arpadroid/tools';
import { List } from '@arpadroid/lists';
import NavLink from '../navLink/navLink.js';

class NavList extends List {
    /** @type {NavListConfigType} */ // @ts-ignore
    _config = this._config;

    /**
     * Creates a new NavList.
     * @param {NavListConfigType} [config]
     */
    constructor(config = {}) {
        super(config);
        this.signal = dummySignal;
        this.on = dummyListener;
        observerMixin(this);
    }
    /**
     * Default component config.
     * @returns {NavListConfigType}
     */
    getDefaultConfig() {
        /** @type {NavListConfigType} */
        const conf = {
            className: 'navList',
            hasResource: false,
            divider: undefined,
            links: [],
            variant: 'default',
            renderMode: 'minimal',
            isItemSelected: undefined,
            itemComponent: NavLink,
            itemTag: 'nav-link'
        };
        return mergeObjects(super.getDefaultConfig(), conf);
    }

    _initializeNodes() {
        this.itemsNode?.setAttribute('role', 'navigation');
    }

    /**
     * Sends a signal when a link is selected.
     * @param {NavLink} link
     */
    onSelected(link) {
        this.signal('selected', link);
    }
}

defineCustomElement('nav-list', NavList);

export default NavList;
