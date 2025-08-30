/**
 * @typedef {import('./iconMenu.types').IconMenuConfigType} IconMenuConfigType
 */
import { mergeObjects, defineCustomElement } from '@arpadroid/tools';
import NavButton from '../navButton/navButton';
class IconMenu extends NavButton {
    /**
     * Returns default config.
     * @returns {IconMenuConfigType}
     */
    getDefaultConfig() {
        this.bind('preProcessNode');
        const defaultConfig = super.getDefaultConfig();
        /** @type {IconMenuConfigType} */
        const conf = {
            className: 'iconMenu',
            classNames: (defaultConfig.classNames || []).concat(['iconButton']),
            buttonClass: 'iconButton__button',
            navType: 'combo',
            icon: 'more_horiz',
            rhsIcon: ''
        };
        const config = mergeObjects(defaultConfig, conf);

        return config;
    }
}

defineCustomElement('icon-menu', IconMenu);

export default IconMenu;
