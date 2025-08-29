/**
 * @typedef {import('./sideNav.types.js').SideNavConfigType} SideNavConfigType
 */
import { observerMixin, dummySignal, dummyListener, defineCustomElement } from '@arpadroid/tools';
//import NavList from '../navList/navList.js';
import { Accordion, ArpaElement } from '@arpadroid/ui';

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
            collapsedClass: 'sideNav--collapsed',
            accordion: {
                enabled: true,
                config: {
                    contentSelector: '.navList',
                    itemSelector: '.navLink, .navButton',
                    handlerSelector: '.navButton__button',
                    isCollapsed: true
                }
            },
            templateChildren: {
                header: { content: '{titleContainer}{headerContent}' },
                headerContent: {},
                titleContainer: { content: '{title}{toggleButton}' },
                toggleButton: {
                    tag: 'icon-button',
                    attr: { icon: 'expand_more', onClick: ':toggleNav' },
                    content: 'expand_more'
                },
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

    /**
     * Toggles the navigation menu.
     * @param {Event} _event
     */
    toggleNav(_event) {
        const className = this.getProperty('collapsed-class');
        if (!className) return;
        if (this.classList.contains(className)) {
            this.classList.remove(className);
        } else {
            this.classList.add(className);
        }
    }

    hasAccordion() {
        return this.hasProperty('has-accordion') || this._config.accordion?.enabled;
    }

    async _onComplete() {
        this._initializeAccordion();
    }

    async _initializeAccordion() {
        if (!this.hasAccordion()) return;
        if (!this.accordion) {
            const links = this.templateNodes.links;
            setTimeout(() => {
                this.accordion = new Accordion(links, this._config.accordion?.config);
            }, 0);
        }
    }

    _getTemplate() {
        return html`{header}{links}{footer}`;
    }
}

defineCustomElement('side-nav', SideNav);

export default SideNav;
