/**
 * @typedef {import('./iconMenu.types').IconMenuConfigType} IconMenuConfigType
 * @typedef {import('@arpadroid/tools').ZoneToolPlaceZoneType} ZoneToolPlaceZoneType
 * @typedef {import('@arpadroid/ui').InputComboNodeType} InputComboNodeType
 * @typedef {import('../navLink/navLink.types').NavLinkConfigType} NavLinkConfigType
 * @typedef {import('@arpadroid/ui').Tooltip} Tooltip
 * @typedef {import('@arpadroid/ui').IconButton} IconButton
 * @typedef {import('@arpadroid/lists').ListItem} ListItem
 * @typedef {import('../navList/navList.js').default} NavList
 * @typedef {import('../navLink/navLink.js').default} NavLink
 */
import { mergeObjects, attrString, classNames, defineCustomElement } from '@arpadroid/tools';
import { Accordion, ArpaElement, Button, InputCombo } from '@arpadroid/ui';

const html = String.raw;
class IconMenu extends ArpaElement {
    /** @type {NavList | null} */
    navigation = null;
    /** @type {Accordion      | null} */
    accordion = null;
    /** @type {IconMenuConfigType} */
    _config = this._config;
    //////////////////////////
    // #region Initialization
    /////////////////////////

    /**
     * Returns default config.
     * @returns {IconMenuConfigType}
     */
    getDefaultConfig() {
        this.bind('preProcessNode');
        /** @type {IconMenuConfigType} */
        const conf = {
            className: 'iconMenu',
            menuPosition: 'bottom',
            icon: 'more_horiz',
            closeOnClick: true,
            closeOnBlur: true,
            hasTabIndex: false,
            links: [],
            tooltip: '',
            navClass: '',
            navType: 'combo'
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
        // if (!node) {
        //     throw new Error('Node is undefined');
        // }
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
     * Sets the tooltip content.
     * @param {string | HTMLElement} content
     */
    setTooltip(content) {
        /** @type {Tooltip | null} */
        const tooltip = this.querySelector('arpa-tooltip');
        tooltip?.setContent(content);
    }

    /**
     * Sets the icon for the button.
     * @param {string} icon
     */
    setIcon(icon) {
        /** @type {IconButton | null} */
        const button = this.querySelector(`.${this.getButtonClass()}`);
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
            button: this.renderButton(),
            nav: this.renderNav()
        };
    }

    _getTemplate() {
        return html`{button}{nav}`;
    }

    /**
     * Renders the button that opens the navigation.
     * @returns {string}
     */
    renderButton() {
        return html`<icon-button
            class="${this.getButtonClass()}"
            ${attrString({
                icon: this.getProperty('icon'),
                tooltip: this.getProperty('tooltip'),
                ariaLabel: this.getAriaLabel()
            })}
        ></icon-button>`;
    }

    /**
     * Renders the navigation component.
     * @returns {string}
     */
    renderNav() {
        return html`<nav-list
            ${attrString({
                itemTag: 'nav-link',
                id: `navList-${this.getId()}`,
                class: classNames(
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
        await super._initializeNodes();
        /** @type {IconButton | Button | null} */
        this.buttonComponent = this.querySelector(`.${this.getButtonClass()}`);
        this._initializeNavigation();
        this.buttonComponent?.promise.then(() => {
            this.button = this.buttonComponent?.button;
            this.hasCombo() && this._initializeInputCombo();
        });
        return true;
    }

    async _initializeNavigation() {
        const { links = [] } = this._config;
        // /** @type {NavList | null} */
        this.navigation = /** @type {NavList} */ (this.querySelector(`.${this.getNavigationClass()}`));
        this.navigation.setPreProcessNode(this.preProcessNode);
        links?.length && this.navigation?.setItems(links, true);
        this.navigation &&
            (this.navigation._childNodes = [
                ...(this.navigation._childNodes || []),
                ...(this._childNodes || [])
            ]);
        this._childNodes = [];
    }

    /**
     * Initializes the input combo component.
     */
    async _initializeInputCombo() {
        if (!this.inputCombo) {
            const { inputComboConfig = {} } = this._config;
            const defaultConfig = {
                closeOnClick: this.hasProperty('close-on-click'),
                closeOnBlur: this.hasProperty('close-on-blur'),
                position: this.hasProperty('menu-position') && this.getProperty('menu-position')
            };
            const config = mergeObjects(defaultConfig, inputComboConfig);
            if (this.button && this.navigation) {
                this.inputCombo = new InputCombo(this.button, this.navigation, {
                    ...config,
                    containerSelector: 'nav-link'
                });
            }
        } else {
            this.button && (this.inputCombo.input = this.button);
            this.navigation && (this.inputCombo.combo = this.navigation);
        }
    }

    async _initializeAccordion() {
        await this.promise;
        this.button = this.buttonComponent?.button;
        if (!this.accordion && this.navigation) {
            this.accordion = new Accordion(this, {
                contentSelector: 'nav-list',
                itemSelector: '.navLink, .navButton',
                handlerSelector: '.navButton__button',
                isCollapsed: true
            });
        }
    }

    /**
     * Transfers the links from the icon menu component zone to the navigation component.
     * @param {ZoneToolPlaceZoneType} payload - The payload object passed by the ZoneTool.
     */
    async _onPlaceZone(payload) {
        const { zone } = payload;
        const children = [...(zone?.childNodes || [])];
        /** @type {NavLink[]} */
        const links = /** @type {NavLink[]} */ (
            children.filter(
                (/** @type {import('@arpadroid/tools').ElementType} **/ node) => node?.tagName === 'NAV-LINK'
            )
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

    // #endregion Lifecycle
}

defineCustomElement('icon-menu', IconMenu);

export default IconMenu;
