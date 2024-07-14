/* eslint-disable sonarjs/no-duplicate-string */
/** @typedef {import('./iconMenuInterface').IconMenuInterface} IconMenuInterface */

import { mergeObjects, attrString } from '@arpadroid/tools';
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
        await this._initializeTooltip();
        return true;
    }

    async _initializeTooltip() {
        this.tooltip = this.button.querySelector('arpa-tooltip');
        await customElements.whenDefined('arpa-tooltip');
        this.tooltip?.promise && (await this.tooltip.promise);
        this.tooltip?.contentNode?.setAttribute('slot', 'menu-tooltip');
    }

    setLinks(links) {
        this._config.links = links;
        this.navigation?.setLinks(links);
    }

    renderButton() {
        const props = {
            icon: this.getProperty('icon'),
            label: this.getProperty('tooltip')
        };
        return html`<button is="icon-button" class="iconMenu__button" ${attrString(props)}></button>`;
    }

    renderNav() {
        const navClass = this.getProperty('nav-class');
        return html`<nav-list
            class="iconMenu__navigation comboBox${navClass ? ` ${navClass}` : ''}"
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
            closeOnClick: this.hasProperty('close-on-click') ?? true,
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
