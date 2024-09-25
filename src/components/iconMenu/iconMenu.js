/** @typedef {import('./iconMenuInterface').IconMenuInterface} IconMenuInterface */
import { mergeObjects, attrString, classNames } from '@arpadroid/tools';
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

    async onReady() {
        await customElements.whenDefined('icon-menu');
        await customElements.whenDefined('nav-list');
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

    // #endregion Initialization

    ////////////////////
    // #region Accessors
    ////////////////////

    setLinks(links) {
        this._config.links = links;
        this.navigation?.setItems(links);
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
        const template = html`${this.renderButton()}${this.renderNav()}`;
        this.innerHTML = template;
        this.navigation = this.querySelector('.iconMenu__navigation');
        this.navigation.setPreProcessNode(this.preProcessNode);
        this.button = this.querySelector('.iconMenu__button');
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
        return html`<nav-list
            class="${classNames('iconMenu__navigation', 'comboBox', this.getProperty('nav-class'))}"
            item-tag="nav-link"
            id="navList-${this.getId()}"
        ></nav-list>`;
    }

    // #endregion Rendering

    ////////////////////
    // #region Lifecycle
    ////////////////////

    async _onConnected() {
        const listItems = this._childNodes.filter(node => node.tagName === 'NAV-LINK');
        this.navigation.addItemNodes(listItems);
        this.navigation.setLinks(this._config.links);
        this.navigation.onRendered(() => this.navigation.prepend(...this._childNodes));
        this._initializeInputCombo();
        return true;
    }

    // #endregion Lifecycle
}
customElements.define('icon-menu', IconMenu);
export default IconMenu;
