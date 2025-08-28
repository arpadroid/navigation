/**
 * @typedef {import('./navButton.types').NavButtonConfigType} NavButtonConfigType
 */
import { mergeObjects, defineCustomElement } from '@arpadroid/tools';
import IconMenu from '../iconMenu/iconMenu';

const html = String.raw;
class NavButton extends IconMenu {
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
            className: 'navButton',
            menuPosition: 'bottom',
            icon: ''
        };
        return mergeObjects(super.getDefaultConfig(), conf);
    }

    // #endregion Initialization

    ////////////////////
    // #region Accessors
    ////////////////////

    // #endregion Accessors

    /////////////////////
    // #region Rendering
    /////////////////////

    /**
     * Renders the button that opens the navigation.
     * @returns {string}
     */
    renderButton() {
        return html`<arpa-button
            class="navButton__arpaButton"
            button-class="navButton__button listItem__main"
            icon="${this.getProperty('icon')}"
            tooltip="${this.getProperty('tooltip')}"
            ariaLabel="${this.getAriaLabel()}"
        >
            <zone name="buttonContent">${this.getProperty('button-label') || this._textContent || ''}</zone>
        </arpa-button>`;
    }

    // #endregion Lifecycle
}

defineCustomElement('nav-button', NavButton);

export default NavButton;
