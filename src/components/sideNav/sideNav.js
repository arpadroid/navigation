/**
 * @typedef {import('./sideNav.types.js').SideNavConfigType} SideNavConfigType
 * @typedef {import('../navButton/navButton.js').default} NavButton
 * @typedef {import('@arpadroid/ui').IconButton} IconButton
 */
import { observerMixin, dummySignal, dummyListener, defineCustomElement } from '@arpadroid/tools';
import { ArpaElement, Tooltip } from '@arpadroid/ui';
import Accordion from '../accordion/accordion.js';

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
            }
        };
        return super.getDefaultConfig(conf);
    }

    $renderTemplate() {
        return html`
            <arpa-node name="header">
                <arpa-node name="titleContainer">
                    <arpa-node name="title" tag="h2"></arpa-node>
                    <arpa-node
                        must-render
                        name="toggleButton"
                        tag="icon-button"
                        icon="expand_more"
                        on-click="{toggleNav}"
                        tooltip="{toggleTooltip()}"
                    >
                        expand_more
                    </arpa-node>
                </arpa-node>
                <arpa-node name="headerContent"></arpa-node>
            </arpa-node>

            <arpa-node name="links"></arpa-node>
            <arpa-node name="footer">
                <arpa-node name="footerContent"></arpa-node>
            </arpa-node>
        `;
    }

    /**
     * Toggles the navigation menu.
     * @param {Event} _event
     */
    toggleNav(_event) {
        const className = this.getProp('collapsed-class');

        const toggleButton = /** @type {IconButton | undefined} */ (this.getNode('toggleButton'));

        if (!className) return;
        if (this.classList.contains(className)) {
            this.classList.remove(className);
            this.classList.add('sideNav--expanding');
            setTimeout(() => this.classList.remove('sideNav--expanding'), 1000);
        } else {
            this.classList.add(className);
        }
        const tooltipText = this.getToggleTooltip();
        toggleButton?.setProp('tooltip', tooltipText);
        toggleButton?.setAttribute('aria-label', tooltipText);
        toggleButton?.setAttribute('label', tooltipText);
    }

    getToggleTooltip() {
        const className = this.getProp('collapsed-class');
        if (!className) return 'Collapse';
        return this.classList.contains(className) ? 'Expand' : 'Collapse';
    }

    hasAccordion() {
        return this.hasProp('has-accordion') || this._config.accordion?.enabled;
    }

    async $onComplete() {
        this._initializeAccordion();
        this._initializeTooltip();
    }

    _initializeTooltip() {
        const linksNode = /** @type {HTMLElement} */ (this.getNode('links'));
        this.tooltip = new Tooltip({
            content: 'Thumbnails tooltip',
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
        await this.onNodesReady();
        if (!this.hasAccordion()) return;
        const links = /** @type {HTMLElement} */ (this.nodes.links);
        if (!this.accordion && links) {
            this.accordion = new Accordion(links, this._config.accordion?.config);
        }
    }
}

defineCustomElement('side-nav', SideNav);

export default SideNav;
