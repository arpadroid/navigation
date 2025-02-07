/**
 * @typedef {import('./iconMenu.types').IconMenuConfigType} IconMenuConfigType
 * @typedef {import('@arpadroid/tools').ZoneToolPlaceZoneType} ZoneToolPlaceZoneType
 * @typedef {import('@arpadroid/ui').InputComboNodeType} InputComboNodeType
 * @typedef {import('../navLink/navLink.types').NavLinkConfigType} NavLinkConfigType
 * @typedef {import('@arpadroid/ui').Tooltip} Tooltip
 * @typedef {import('@arpadroid/ui').IconButton} IconButton
 * @typedef {import('@arpadroid/lists/src/components/listItem/listItem.js').default} ListItem
 */
import { mergeObjects, attrString, classNames, appendNodes } from '@arpadroid/tools';
import { ArpaElement, InputCombo } from '@arpadroid/ui';
import NavList from '../navList/navList.js';

const html = String.raw;
class IconMenu extends ArpaElement {
    /** @type {IconMenuConfigType} */ // @ts-ignore
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

    render() {
        const { links = [] } = this._config;
        const template = html`${this.renderButton()}${this.renderNav()}`;
        this.innerHTML = template;
        /** @type {NavList | null} */
        this.navigation = /** @type {NavList} */ (this.querySelector('.iconMenu__navigation'));
        // @ts-ignore
        this.navigation?.setPreProcessNode(this.preProcessNode);
        links?.length && this.navigation?.setItems(links);
        this.navigation &&
            (this.navigation._childNodes = [
                ...(this.navigation._childNodes || []),
                ...(this._childNodes || [])
            ]);
        this._childNodes = [];
        /** @type {import('@arpadroid/ui').InputComboInputType<IconButton> | null} */
        this.button = this.querySelector('.iconMenu__button');
    }

    /**
     * Transfers the links from the icon menu component zone to the navigation component.
     * @param {ZoneToolPlaceZoneType} payload - The payload object passed by the ZoneTool.
     */
    async _onPlaceZone(payload) {
        const { zone } = payload;
        const children = [...(zone?.childNodes || [])];
        // @ts-ignore
        const links = children.filter((/** @type {Node} **/ node) => node?.tagName === 'NAV-LINK');
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

    /**
     * Renders the button that opens the navigation.
     * @returns {string}
     */
    renderButton() {
        return html`<button
            is="icon-button"
            class="iconMenu__button"
            ${attrString({
                icon: this.getProperty('icon'),
                label: this.getProperty('tooltip'),
                ariaLabel: this.getProperty('button-label') || this.getProperty('tooltip')
            })}
        ></button>`;
    }

    /**
     * Renders the navigation component.
     * @returns {string}
     */
    renderNav() {
        const attr = attrString({
            itemTag: 'nav-link',
            id: `navList-${this.getId()}`,
            class: classNames('iconMenu__navigation', 'comboBox', this.getProperty('nav-class'))
        });
        return html`<nav-list ${attr}> </nav-list>`;
    }

    // #endregion Rendering

    ////////////////////
    // #region Lifecycle
    ////////////////////

    async _onConnected() {
        this._initializeInputCombo();
        return true;
    }

    /**
     * Initializes the input combo component.
     */
    _initializeInputCombo() {
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

    // #endregion Lifecycle
}
customElements.define('icon-menu', IconMenu);
export default IconMenu;
