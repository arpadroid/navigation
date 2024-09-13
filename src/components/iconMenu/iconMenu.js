/* eslint-disable sonarjs/no-duplicate-string */
/** @typedef {import('./iconMenuInterface').IconMenuInterface} IconMenuInterface */

import { mergeObjects, attrString, classNames } from '@arpadroid/tools';
import { ArpaElement, InputCombo } from '@arpadroid/ui';
// import { ArpaElement, InputCombo } from '../../../../exports.js';

const html = String.raw;
class IconMenu extends ArpaElement {
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
            navComboClasses: 'selectCombo'
        });
    }

    async onReady() {
        await customElements.whenDefined('icon-menu');
        await customElements.whenDefined('nav-list');
        return true;
    }

    render() {
        const template = html`${this.renderButton()}${this.renderNav()}`;
        this.innerHTML = template;
        this.navigation = this.querySelector('.iconMenu__navigation');
        this.button = this.querySelector('.iconMenu__button');
    }

    async _onConnected() {
        const listItems = this._childNodes.filter(node => node.tagName === 'NAV-LINK');
        this.navigation.preProcessNode(this.preProcessNode);
        this.navigation.addItemNodes(listItems);
        this.navigation.setLinks(this._config.links);
        this.navigation.onRendered(() => {
            this.navigation.prepend(...this._childNodes);
        });
        this._initializeInputCombo();
        return true;
    }

    setLinks(links) {
        this._config.links = links;
        this.navigation?.setLinks(links);
    }

    renderButton() {
        const props = {
            icon: this.getProperty('icon'),
            label: this.getProperty('tooltip'),
            ariaLabel: this.getProperty('tooltip'),
        };
        return html`<button is="icon-button" class="iconMenu__button" ${attrString(props)}></button>`;
    }

    renderNav() {
        return html`<nav-list
            class="${classNames('iconMenu__navigation', 'comboBox', this.getProperty('nav-class'))}"
            id="${this.getId()}-navList"
        ></nav-list>`;
    }

    preProcessNode(node) {
        node.classList.add('comboBox__item');
        !this.getProperty('has-tab-index') &&
            Array.from(node.querySelectorAll('a, button')).forEach(node =>
                node.setAttribute('tabindex', '-1')
            );
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

    getId() {
        return this.getProperty('id') || 'IconMenu-' + Math.random().toString(36).substr(2, 9);
    }

    setTooltip(content) {
        this.querySelector('arpa-tooltip')?.setContent(content);
    }

    setIcon(icon) {
        this.querySelector('.iconMenu__button arpa-icon')?.setIcon(icon);
    }
}
customElements.define('icon-menu', IconMenu);
export default IconMenu;
