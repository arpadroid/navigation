/**
 * @typedef {import('./iconMenu.types').IconMenuConfigType} IconMenuConfigType
 * @typedef {import('@arpadroid/tools').ZoneToolPlaceZoneType} ZoneToolPlaceZoneType
 * @typedef {import('@arpadroid/ui').InputComboNodeType} InputComboNodeType
 * @typedef {import('../navLink/navLink.types').NavLinkConfigType} NavLinkConfigType
 * @typedef {import('@arpadroid/ui').Tooltip} Tooltip
 * @typedef {import('@arpadroid/ui').IconButton} IconButton
 * @typedef {import('@arpadroid/lists').ListItem} ListItem
 * @typedef {import('../navList/navList.js').default} NavList
 */
import { mergeObjects, attrString, classNames, appendNodes, defineCustomElement } from '@arpadroid/tools';
import { ArpaElement, InputCombo } from '@arpadroid/ui';

const html = String.raw;
class IconMenu extends ArpaElement {
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
            navClass: ''
        };
        return mergeObjects(super.getDefaultConfig(), conf);
    }

    // #endregion Initialization

    ////////////////////
    // #region Accessors
    ////////////////////

    getAriaLabel() {
        return (
            this.getProperty('button-aria') || this.getProperty('button-label') || this.getProperty('tooltip')
        );
    }

    /**
     * Sets the links for the navigation.
     * @param {NavLinkConfigType[]} links
     */
    setLinks(links) {
        this._config.links = links;
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
        node?.classList.add('comboBox__item');
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
        const button = this.querySelector('.iconMenu__button arpa-icon');
        button?.setIcon(icon);
    }

    // #endregion Accessors

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
            class="iconMenu__button"
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
                class: classNames('iconMenu__navigation', 'comboBox', this.getProperty('nav-class'))
            })}
        ></nav-list>`;
    }

    // #endregion Rendering

    ////////////////////
    // #region Lifecycle
    ////////////////////

    async _initializeNodes() {
        /** @type {IconButton | null} */
        this.buttonComponent = this.querySelector('.iconMenu__button');
        super._initializeNodes();
        this._initializeNavigation();
        this._initializeInputCombo();
        await this.buttonComponent?.promise;
        return true;
    }

    _initializeNavigation() {
        const { links = [] } = this._config;
        /** @type {NavList | null} */
        this.navigation = /** @type {NavList} */ (this.querySelector('.iconMenu__navigation'));
        this.navigation?.setPreProcessNode(this.preProcessNode);
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
        await this.buttonComponent?.promise;
        this.button = this.buttonComponent?.button;
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

    /**
     * Transfers the links from the icon menu component zone to the navigation component.
     * @param {ZoneToolPlaceZoneType} payload - The payload object passed by the ZoneTool.
     */
    async _onPlaceZone(payload) {
        const { zone } = payload;
        const children = [...(zone?.childNodes || [])];

        const links = children.filter(
            (/** @type {import('@arpadroid/tools').ElementType} **/ node) => node?.tagName === 'NAV-LINK'
        );
        links.forEach(link => link.remove());
        links.length &&
            this.onRenderReady(() => {
                /** @type {NavList | null} */
                this.navigation = /** @type {NavList | null} */ (this.querySelector('.iconMenu__navigation'));
                this.navigation &&
                    this.navigation?.onRenderReady(() =>
                        appendNodes(/** @type {HTMLElement} **/ (this.navigation), links)
                    );
            });
    }

    // #endregion Lifecycle
}

defineCustomElement('icon-menu', IconMenu);

export default IconMenu;
