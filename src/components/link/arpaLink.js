import { defineCustomElement, mergeObjects } from '@arpadroid/tools';
import NavLink from '../navLink/navLink.js';

class Link extends NavLink {
    getDefaultConfig() {
        this.bind('_onRouteChange', '_onHandleRouter');
        return mergeObjects(super.getDefaultConfig(), {
            listSelector: ''
        });
    }
}

defineCustomElement('arpa-link', Link);

export default Link;
