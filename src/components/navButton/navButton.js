/**
 * @typedef {import('./navButton.types').NavButtonConfigType} NavButtonConfigType
 * @typedef {import('../navLink/navLink.types').NavLinkConfigType} NavLinkConfigType
 * @typedef {import('@arpadroid/lists').ListItem} ListItem
 * @typedef {import('../navList/navList.js').default} NavList
 */
import { mergeObjects, classNames, defineCustomElement } from '@arpadroid/tools';
import { Button, InputCombo } from '@arpadroid/ui';
import Accordion from '../accordion/accordion.js';

const html = String.raw;
class NavButton extends Button {
    /** @type {NavList | null} */
    navigation = null;
    /** @type {Accordion | null} */
    accordion = null;
    /** @type {NavButtonConfigType} */
    _config = this._config;

    /**
     * Returns default config.
     * @returns {NavButtonConfigType}
     */
    getDefaultConfig() {
        this.bind('preProcessNode');
        /** @type {NavButtonConfigType} */
        const conf = {
            buttonClass: 'navButton__button arpaButton__button',
            classNames: ['navButton'],
            menuPosition: 'bottom',
            navType: 'combo',
            rhsIcon: 'chevron_left',
            closeOnClick: true,
            closeOnBlur: true,
            hasTabIndex: false,
            links: [],
            tooltip: '',
            navClass: '',
            nodesConfig: {
                nav: { canRender: true },
                content: { isContent: false }
            }
        };
        return mergeObjects(super.getDefaultConfig(), conf);
    }

    ////////////////////
    // #region Get
    ////////////////////

    getAriaLabel() {
        return this.getProp('button-aria') || this.getProp('button-label') || this.getProp('tooltip');
    }

    /**
     * Pre-processes the node before adding it to the list.
     * @param {HTMLElement | ListItem | undefined} [node]
     * @returns {HTMLElement | ListItem | undefined}
     * @throws {Error} If node is undefined.
     */
    preProcessNode(node) {
        this.hasCombo() && node?.classList.add('comboBox__item');
        !this.getProp('has-tab-index') &&
            node &&
            Array.from(node.querySelectorAll('a, button')).forEach(node =>
                node.setAttribute('tabindex', '-1')
            );
        return node;
    }

    getId() {
        return this.getProp('id') || 'IconMenu-' + Math.random().toString(36).substr(2, 9);
    }

    getNavigationClass() {
        return this.getClassName('navigation');
    }

    hasCombo() {
        return this.getNavType() === 'combo';
    }

    hasAccordion() {
        return this.getNavType() === 'accordion';
    }

    getNavType() {
        return this.getProp('navType') || 'combo';
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
            id: this.getId()
        };
    }

    $renderTemplate() {
        return html`
            ${super.$renderTemplate()}
            <nav-list
                zone="nav"
                is-content="true"
                item-tag="nav-link"
                id="navList-{id}"
                class="${classNames(
                    ...(this.getArrayProp('button-classes') || []),
                    this.getNavigationClass(),
                    this.hasCombo() && 'comboBox',
                    this.getProp('nav-class')
                )}"
            ></nav-list>
        `;
    }

    // #endregion Rendering

    ////////////////////
    // #region Lifecycle
    ////////////////////

    async $initializeNodes() {
        this._initializeNavigation();
        await super.$initializeNodes();
        this.hasAccordion() && this._initializeAccordion();
        this.hasCombo() && this._initializeInputCombo();
        return true;
    }

    async _initializeNavigation() {
        const { links = [] } = this._config;
        const navClass = this.getNavigationClass();
        this.navigation = /** @type {NavList} */ (this.querySelector(`.${navClass}`));
        // @ts-ignore
        this.navigation.setPreProcessNode(this.preProcessNode);
        links?.length && this.navigation?.setItems(links, true);
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
            closeOnClick: this.hasProp('closeOnClick'),
            closeOnBlur: this.hasProp('closeOnBlur'),
            position: this.hasProp('menuPosition') && this.getProp('menuPosition'),
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
}

defineCustomElement('nav-button', NavButton);

export default NavButton;
