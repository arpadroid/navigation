/**
 * @typedef {import('../../../navButton/navButton.types').NavButtonConfigType} NavButtonConfigType
 */
import { mergeObjects, defineCustomElement } from '@arpadroid/tools';
import NavButton from '../../../navButton/navButton';

class SideNavButton extends NavButton {
    /**
     * Returns default config.
     * @returns {NavButtonConfigType}
     */
    getDefaultConfig() {
        /** @type {NavButtonConfigType} */
        const conf = {
            navType: 'none'
        };
        return mergeObjects(super.getDefaultConfig(), conf);
    }

    getSideNav() {
        return this.closest('side-nav');
    }

    _onConnected() {
        this.sideNav = this.getSideNav();
    }
}

defineCustomElement('side-nav-button', SideNavButton);

export default SideNavButton;
