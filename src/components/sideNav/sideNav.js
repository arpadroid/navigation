/**
 * @typedef {import('./sideNav.types.js').SideNavConfigType} SideNavConfigType
 * @typedef {import('../navButton/navButton.js').default} NavButton
 */
import { observerMixin, dummySignal, dummyListener, defineCustomElement } from '@arpadroid/tools';
//import NavList from '../navList/navList.js';
import { Accordion, ArpaElement, IconButton, Tooltip } from '@arpadroid/ui';

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
        this.bind('_onTooltipTargetUpdate');
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
            collapsedClass: 'sideNav--collapsing',
            accordion: {
                enabled: true,
                config: {
                    contentSelector: '.navList',
                    itemSelector: '.navLink, .navButton',
                    handlerSelector: '.navButton > button',
                    isCollapsed: true
                }
            },
            templateChildren: {
                header: { content: '{titleContainer}{headerContent}' },
                headerContent: {},
                titleContainer: { content: '{title}{toggleButton}' },
                toggleButton: {
                    tag: 'icon-button',
                    attr: {
                        icon: 'expand_more',
                        onClick: ':toggleNav',
                        tooltip: this.getToggleTooltip()
                    },
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

    _getTemplate() {
        return html`{header}{links}{footer}`;
    }

    /**
     * Toggles the navigation menu.
     * @param {Event} _event
     */
    toggleNav(_event) {
        const className = this.getProperty('collapsed-class');

        const toggleButton = /** @type {IconButton | undefined} */ (this.getChild('toggleButton'));

        if (!className) return;
        if (this.classList.contains(className)) {
            this.classList.remove(className);
            this.classList.add('sideNav--expanding');
            setTimeout(() => this.classList.remove('sideNav--expanding'), 1000);
        } else {
            this.classList.add(className);
        }
        const tooltipText = this.getToggleTooltip();
        toggleButton?.setTooltip(tooltipText);
        toggleButton?.setAttribute('aria-label', tooltipText);
        toggleButton?.setAttribute('label-text', tooltipText);
    }

    getToggleTooltip() {
        const className = this.getProperty('collapsed-class');
        if (!className) return 'Collapse';
        return this.classList.contains(className) ? 'Expand' : 'Collapse';
    }

    hasAccordion() {
        return this.hasProperty('has-accordion') || this._config.accordion?.enabled;
    }

    async _onComplete() {
        this._initializeAccordion();
        this._initializeTooltip();
    }

    _initializeTooltip() {
        const linksNode = this.getChild('links');
        this.tooltip = new Tooltip({
            text: 'Thumbnails tooltip',
            className: 'sideNav__tooltip',
            handler: linksNode,
            position: 'cursor',
            hasCursorPosition: true,
            cursorTooltipPosition: 'right',
            cursorPositionAxis: 'y',
            onMouseTargetUpdate: this._onTooltipTargetUpdate
        });
        this.appendChild(this.tooltip);
    }

    /**
     * Updates the tooltip position based on the target element.
     * @param {HTMLElement} target
     */
    _onTooltipTargetUpdate(target) {
        const tagName = target?.tagName.toLowerCase();
        const tags = ['button', 'a'];
        if (!tags.includes(tagName || '')) return;
        const content =
            target.querySelector('.arpaButton__content, .listItem__content')?.textContent?.trim() || ' ';
        this.tooltip?.setContent(content);
    }

    async _initializeAccordion() {
        if (!this.hasAccordion()) return;
        if (!this.accordion) {
            const links = this.templateNodes.links;
            setTimeout(() => {
                this.accordion = new Accordion(links, this._config.accordion?.config);
            });
        }
    }
}

defineCustomElement('side-nav', SideNav);

export default SideNav;
