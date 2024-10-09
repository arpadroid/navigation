/** @typedef {import('./iconMenuInterface').IconMenuInterface} IconMenuInterface */
import { mergeObjects, attrString, classNames, appendNodes } from '@arpadroid/tools';
import { ArpaElement, InputCombo } from '@arpadroid/ui';
// import { ArpaElement, InputCombo } from '../../../../exports.js';

const html = String.raw;
class IconMenu extends ArpaElement {
    //////////////////////////
    // #region Initialization
    /////////////////////////
    _bindings = ['preProcessNode'];
    /**
     * Returns default config.
     * @returns {IconMenuInterface}
     */
    getDefaultConfig() {
        return mergeObjects(super.getDefaultConfig(), {
            className: 'iconMenu',
            menuPosition: 'bottom',
            icon: 'more_horiz',
            closeOnClick: true,
            closeOnBlur: true,
            hasTabIndex: false,
            links: [],
            tooltip: '',
            navClass: ''
        });
    }

    // #endregion Initialization

    ////////////////////
    // #region Accessors
    ////////////////////

    setLinks(links) {
        this._config.links = links;
    }

    /**
     * Pre-processes the node before adding it to the list.
     * @param {HTMLElement} node
     */
    preProcessNode(node) {
        node.classList.add('comboBox__item');
        !this.getProperty('has-tab-index') &&
            Array.from(node.querySelectorAll('a, button')).forEach(node =>
                node.setAttribute('tabindex', '-1')
            );
    }

    getId() {
        return this.getProperty('id') || 'IconMenu-' + Math.random().toString(36).substr(2, 9);
    }

    setTooltip(content) {
        this.querySelector('arpa-tooltip')?.setContent(content);
    }

    setIcon(icon) {
        this.querySelector('.iconMenu__button arpa-icon')?.setIcon(icon);
    }

    // #endregion Accessors

    /////////////////////
    // #region Rendering
    /////////////////////

    render() {
        const { links = [] } = this._config;
        const template = html`${this.renderButton()}${this.renderNav()}`;
        this.innerHTML = template;
        this.navigation = this.querySelector('.iconMenu__navigation');
        this.navigation.setPreProcessNode(this.preProcessNode);
        links?.length && this.navigation.setItems(links);
        this.navigation._childNodes = [...this.navigation._childNodes, ...this._childNodes];
        this._childNodes = [];
        this.button = this.querySelector('.iconMenu__button');
    }

    async _onPlaceZone(payload) {
        const { zone } = payload;
        const children = [...zone.childNodes];
        const links = children.filter(node => node.tagName === 'NAV-LINK');
        links.forEach(link => link.remove());
        links.length &&
            this.onRenderReady(() => {
                this.navigation = this.querySelector('.iconMenu__navigation');
                this.navigation.onRenderReady(() => appendNodes(this.navigation, links));
            });
    }

    renderButton() {
        return html`<button
            is="icon-button"
            class="iconMenu__button"
            ${attrString({
                icon: this.getProperty('icon'),
                label: this.getProperty('tooltip'),
                ariaLabel: this.getProperty('tooltip')
            })}
        ></button>`;
    }

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

    _initializeInputCombo() {
        const { inputComboConfig = {} } = this._config;
        const defaultConfig = {
            closeOnClick: this.hasProperty('close-on-click'),
            closeOnBlur: this.hasProperty('close-on-blur'),
            position: this.getProperty('menu-position')
        };
        const config = mergeObjects(defaultConfig, inputComboConfig);
        this.inputCombo = new InputCombo(this.button, this.navigation, {
            ...config,
            containerSelector: 'nav-link'
        });
    }

    // #endregion Lifecycle
}
customElements.define('icon-menu', IconMenu);
export default IconMenu;
