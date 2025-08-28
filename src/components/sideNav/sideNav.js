/**
 * @typedef {import('./sideNav.types.js').SideNavConfigType} SideNavConfigType
 */
import { observerMixin, dummySignal, dummyListener, defineCustomElement } from '@arpadroid/tools';
//import NavList from '../navList/navList.js';
import { ArpaElement } from '@arpadroid/ui';

const html = String.raw;

class SideNav extends ArpaElement {
    /** @type {SideNavConfigType} */
    _config = this._config;

    /**
     * Creates a new NavList.
     * @param {SideNavConfigType} [config]
     */
    constructor(config = {}) {
        super(config);
        this.signal = dummySignal;
        this.on = dummyListener;
        observerMixin(this);
    }
    /**
     * Default component config.
     * @returns {SideNavConfigType}
     */
    getDefaultConfig() {
        /** @type {SideNavConfigType} */
        const conf = {
            className: 'sideNav',
            templateChildren: {
                header: { content: '{title}{headerContent}' },
                headerContent: {},
                title: { tag: 'h2' },
                links: {},
                footer: {
                    content: '{footerContent}'
                },
                footerContent: {}
            }
        };
        return super.getDefaultConfig(conf);
    }

    async _initializeNodes() {
        await super._initializeNodes();

        return true;
    }

    _getTemplate() {
        return html`{header}{links}{footer}`;
    }
}

defineCustomElement('side-nav', SideNav);

export default SideNav;
