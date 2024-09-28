/** @typedef {import('./navLinkInterface.js').NavLinkInterface} NavLinkInterface */
import { renderNode, editURL, mergeObjects, attr, sanitizeURL } from '@arpadroid/tools';
import { Context } from '@arpadroid/application';
import { ListItem } from '@arpadroid/lists';

const html = String.raw;
class NavLink extends ListItem {
    cleanup;
    _bindings = ['_onClick'];
    //////////////////////////
    // #region INITIALIZATION
    //////////////////////////
    /**
     * Gets the default config for the component.
     * @returns {NavLinkInterface}
     */
    getDefaultConfig() {
        return mergeObjects(super.getDefaultConfig(), {
            link: '',
            action: undefined,
            role: '',
            className: 'navLink',
            listSelector: '.navList',
            selected: false,
            handlerAttributes: {}
        });
    }

    _initialize() {
        this.cleanup = [
            Context?.Router?.listen('ROUTE_CHANGE', () => {
                this._handleSelected();
                this.updateAriaCurrent();
            })
        ];
    }

    _handleSelected() {
        if (this.nav && this.isSelectedLink()) {
            this.nav?.onSelected(this);
        }
    }

    // #endregion

    ////////////////////
    // #region Lifecycle
    ////////////////////

    _initializeNodes() {
        this.nav = this.closest('.navList');
        super._initializeNodes();
        this.linkNode = this.mainNode;
        !this._hasRendered &&
            attr(this.linkNode, {
                ...(this._config.handlerAttributes ?? {}),
                'aria-current': this.getAriaCurrent()
            });
    }

    disconnectedCallback() {
        this.cleanup?.forEach(cleanup => typeof cleanup === 'function' && cleanup());
    }

    // #endregion Lifecycle

    // #region Accessors

    updateAriaCurrent() {
        this.linkNode && attr(this.linkNode, { 'aria-current': this.getAriaCurrent() });
    }

    getTagName() {
        return 'nav-link';
    }

    getNav() {
        return this.nav || this.closest('nav-list');
    }

    getParamName() {
        return this.getNav()?.getProperty('param-name') || this.getProperty('param-name');
    }

    getParamValue() {
        return this.getProperty('param-value');
    }

    getParamClear() {
        return this.getNav()?.getArrayProperty('param-clear') || this.getArrayProperty('param-clear');
    }

    hasRouter() {
        return this.getNav()?.hasProperty('use-router') || this.hasAttribute('use-router');
    }

    getLink() {
        const param = this.getParamName();
        const value = this.getParamValue();
        const clear = this.getParamClear();
        if (!value) {
            return this.getProperty('link');
        }
        if (param && value) {
            const params = { [param]: value };
            clear?.forEach(param => (params[param] = undefined));
            return editURL(location.href, params);
        }
        return this.getProperty('link');
    }

    getAriaCurrent() {
        if (this.isSelected()) {
            return 'location';
        }
        if (this.isSelectedLink()) {
            return 'page';
        }
    }

    isSelected() {
        return this.getProperty('selected');
    }

    isSelectedLink() {
        if (this.link) {
            const paramName = this.getParamName();
            const paramValue = this.getParamValue();
            if (paramName && paramValue) {
                const currentParam = new URLSearchParams(window.location.search).get(paramName);
                return currentParam === paramValue || (!currentParam && this.hasAttribute('default'));
            }
            const path = sanitizeURL(this.link);
            const currentPath = sanitizeURL(window.parent.location.href);
            return path === currentPath;
        }
        return false;
    }

    getDivider() {
        if (this.list) {
            return this.list.getVariant() === 'horizontal' && this.getListDivider();
        }
        return this._config?.divider;
    }

    getListDivider() {
        return this.list?._zones.find(zone => zone.name === 'divider') || this.list?.getProperty('divider');
    }

    // #endregion Accessors

    //////////////////
    // #region Render
    /////////////////

    async render() {
        super.render();
        await this.onReady();
        this.insertDivider();
        this._handleSelected();
        if (this.hasRouter()) {
            this.linkNode.addEventListener('click', this._onClick);
        }
        const tooltip = this.getProperty('tooltip') || '';
        const tooltipZone = this.getZone('tooltip');
        if (tooltipZone || tooltip) {
            const position = this.getProperty('tooltip-position') || 'left';
            this.tooltip = renderNode(html`
                <arpa-tooltip handler="a" class="navLink__tooltip" position="${position}">
                    <arpa-zone name="tooltip-content">${tooltip}</arpa-zone>
                </arpa-tooltip>
            `);
            const zone = this.tooltip.querySelector('arpa-zone');
            zone && zone.append(...Array.from(tooltipZone.childNodes));
            this.mainNode?.append(this.tooltip);
        }
    }

    _onClick(event) {
        event.preventDefault();
        Context.Router.go(this.getLink());
    }

    renderDivider() {
        const divider = this.getDivider();
        const node = document.createElement('span');
        node.classList.add('navLink__divider');
        typeof divider === 'string' && (node.textContent = divider);
        divider instanceof HTMLElement && (node.innerHTML = divider.innerHTML);
        return node;
    }

    insertDivider() {
        const isLastNode = this.nextElementSibling === null;
        if (!isLastNode && this.getDivider() && !this.dividerNode) {
            this.dividerNode = this.renderDivider();
            this.after(this.dividerNode);
        }
    }

    // #endregion
}

customElements.define('nav-link', NavLink);

export default NavLink;
