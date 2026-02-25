/**
 * @typedef {import('./navButton.types').NavButtonConfigType} NavButtonConfigType
 * @typedef {import('@arpadroid/ui').ZoneToolPlaceZoneType} ZoneToolPlaceZoneType
 * @typedef {import('@arpadroid/ui').InputComboNodeType} InputComboNodeType
 * @typedef {import('../navLink/navLink.types').NavLinkConfigType} NavLinkConfigType
 * @typedef {import('@arpadroid/ui').Tooltip} Tooltip
 * @typedef {import('@arpadroid/ui').IconButton} IconButton
 * @typedef {import('@arpadroid/lists').ListItem} ListItem
 * @typedef {import('../navList/navList.js').default} NavList
 * @typedef {import('../navLink/navLink.js').default} NavLink
 */
import { mergeObjects, attrString, classNames, defineCustomElement } from '@arpadroid/tools';
import { Button, InputCombo } from '@arpadroid/ui';
import Accordion from '../accordion/accordion.js';

const html = String.raw;
class NavButton extends Button {
    /** @type {NavList | null} */
    navigation = null;
    /** @type {Accordion      | null} */
    accordion = null;

    // #endregion Lifecycle

    /** @type {NavButtonConfigType} */
    _config = this._config;
    //////////////////////////
    // #region Initialization
    /////////////////////////

    /**
     * Returns default config.
     * @returns {NavButtonConfigType}
     */
    getDefaultConfig() {
        this.bind('preProcessNode');
        /** @type {NavButtonConfigType} */
        const conf = {
            buttonClass: 'navButton__button arpaButton__button',
            classNames: ['navButton', 'listItem__main'],
            menuPosition: 'bottom',
            navType: 'combo',
            rhsIcon: 'chevron_left',
            closeOnClick: true,
            closeOnBlur: true,
            hasTabIndex: false,
            links: [],
            tooltip: '',
            navClass: '',
            templateChildren: {
                nav: { canRender: true }
            }
        };
        return mergeObjects(super.getDefaultConfig(), conf);
    }

    // #endregion Initialization

    ////////////////////
    // #region Get
    ////////////////////

    getAriaLabel() {
        return (
            this.getProperty('button-aria') || this.getProperty('button-label') || this.getProperty('tooltip')
        );
    }

    /**
     * Pre-processes the node before adding it to the list.
     * @param {HTMLElement | ListItem | undefined} [node]
     * @returns {HTMLElement | ListItem | undefined}
     * @throws {Error} If node is undefined.
     */
    preProcessNode(node) {
        this.hasCombo() && node?.classList.add('comboBox__item');
        !this.getProperty('has-tab-index') &&
            node &&
            Array.from(node.querySelectorAll('a, button')).forEach(node =>
                node.setAttribute('tabindex', '-1')
            );
        return node;
    }

    getId() {
        return this.getProperty('id') || 'IconMenu-' + Math.random().toString(36).substr(2, 9);
    }

    getNavigationClass() {
        return this.getClassName('navigation');
    }

    getButtonClass() {
        return this.getClassName('arpaButton');
    }

    hasCombo() {
        return this.getNavType() === 'combo';
    }

    hasAccordion() {
        return this.getNavType() === 'accordion';
    }

    getNavType() {
        return this.getProperty('nav-type') || 'combo';
    }

    // #endregion Get

    ////////////////////
    // #region Set
    ////////////////////

    /**
     * Sets the navigation type.
     * @param {'combo' | 'accordion' | 'none'} type
     */
    setNavType(type) {
        this._config.navType = type;
    }

    /**
     * Sets the icon for the button.
     * @param {string} icon
     */
    setIcon(icon) {
        /** @type {IconButton | null} */
        const button = this.querySelector('.arpaButton__button');
        button?.setIcon(icon);
    }

    /**
     * Sets the links for the navigation.
     * @param {NavLinkConfigType[]} links
     */
    setLinks(links) {
        this._config.links = links;
    }
    // #endregion Set

    /////////////////////
    // #region Rendering
    /////////////////////

    getTemplateVars() {
        return {
            ...super.getTemplateVars(),
            nav: this.renderNav()
        };
    }

    _getTemplate() {
        return html`${super.renderButton()}{nav}`;
    }

    /**
     * Renders the navigation component.
     * @returns {string}
     */
    renderNav() {
        const btnClasses = this.getArrayProperty('button-classes') || [];
        return html`<nav-list
            ${attrString({
                itemTag: 'nav-link',
                id: `navList-${this.getId()}`,
                class: classNames(
                    ...btnClasses,
                    this.getNavigationClass(),
                    this.hasCombo() && 'comboBox',
                    this.getProperty('nav-class')
                )
            })}
        ></nav-list>`;
    }

    // #endregion Rendering

    ////////////////////
    // #region Lifecycle
    ////////////////////

    async _initializeNodes() {
        /** @type {HTMLButtonElement | undefined | null} */
        this.button = this.querySelector('button');
        this._initializeNavigation();
        await super._initializeNodes();
        this.hasAccordion() && this._initializeAccordion();
        this.promise.then(() => {
            const remaining = /** @type {ListItem[]} */ (
                this._childNodes?.filter(child => child instanceof HTMLElement && !child.isConnected)
            );
            if (remaining?.length) {
                this.navigation?.addItemNodes(remaining);
            }
            this.hasCombo() && this._initializeInputCombo();
        });
        return true;
    }

    async _initializeNavigation() {
        const { links = [] } = this._config;
        const navClass = this.getNavigationClass();
        this.navigation = /** @type {NavList} */ (this.querySelector(`.${navClass}`));
        this.navigation.setPreProcessNode(this.preProcessNode);
        links?.length && this.navigation?.setItems(links, true);
    }

    getLinksFromChildNodes() {
        return this._childNodes?.filter(
            child => child instanceof HTMLElement && child.tagName?.toLowerCase() === 'nav-link'
        );
    }

    /**
     * Initializes the input combo component.
     */
    async _initializeInputCombo() {
        if (!this.button || !this.navigation) return;
        if (this.inputCombo) {
            this.inputCombo.input = this.button;
            this.inputCombo.combo = this.navigation;
            return;
        }
        this.inputCombo = new InputCombo(this.button, this.navigation, this.getInputComboConfig());
    }

    getInputComboConfig() {
        const defaults = {
            closeOnClick: this.hasProperty('close-on-click'),
            closeOnBlur: this.hasProperty('close-on-blur'),
            position: this.hasProperty('menu-position') && this.getProperty('menu-position'),
            containerSelector: 'nav-link'
        };
        return mergeObjects(defaults, this._config?.inputComboConfig || {});
    }

    async _initializeAccordion() {
        await this.promise;
        if (this.accordion || !this.navigation) return;
        this.accordion = new Accordion(this, {
            contentSelector: 'nav-list',
            itemSelector: '.navLink, .navButton',
            handlerSelector: '.navButton > button',
            isCollapsed: true
        });
    }

    /**
     * Transfers the links from the icon menu component zone to the navigation component.
     * @param {ZoneToolPlaceZoneType} payload - The payload object passed by the ZoneTool.
     */
    async _onPlaceZone(payload) {
        const { zone } = payload;
        const children = [...(zone?.childNodes || [])];

        const links = /** @type {ListItem[]} */ (
            children.filter(node => node instanceof HTMLElement && node.tagName === 'NAV-LINK')
        );
        if (!links.length) return;
        links.forEach(link => link.remove());
        this.onRenderReady(() => {
            this.navigation = /** @type {NavList | null} */ (
                this.querySelector(`.${this.getNavigationClass()}`)
            );
            this.navigation?.addItemNodes(links);
        });
    }

    getContentNodes() {
        return this._childNodes?.filter(
            child => child instanceof HTMLElement && child.tagName?.toLowerCase() !== 'nav-link'
        );
    }
}

defineCustomElement('nav-button', NavButton);

export default NavButton;
