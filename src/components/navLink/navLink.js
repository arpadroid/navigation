/** @typedef {import('./navLinkInterface.js').NavLinkInterface} NavLinkInterface */
import { renderNode, editURL, mergeObjects, attr, sanitizeURL, getURLParam } from '@arpadroid/tools';
import { Context } from '@arpadroid/application';
import { ListItem } from '@arpadroid/lists';

const html = String.raw;
class NavLink extends ListItem {
    cleanup;

    //////////////////////////
    // #region Initialization
    //////////////////////////
    /**
     * Gets the default config for the component.
     * @returns {NavLinkInterface}
     */
    getDefaultConfig() {
        this._onRouteChange = this._onRouteChange.bind(this);
        this._onHandleRouter = this._onHandleRouter.bind(this);
        /** @todo - Handle removing event listener for _onRouteChange.  */
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

    // #endregion

    //////////////////
    // #region get
    /////////////////

    getTagName() {
        return 'nav-link';
    }

    getParamName() {
        return this.grabList()?.getProperty('param-name') || this.getProperty('param-name');
    }

    getParamValue() {
        return this.getProperty('param-value');
    }

    getParamClear() {
        return this.grabList()?.getArrayProperty('param-clear') || this.getArrayProperty('param-clear');
    }

    getLink() {
        const param = this.getParamName();
        const value = this.getParamValue();
        const clear = this.getParamClear();
        if (!value) return this.getProperty('link');
        if (param && value) {
            const params = { [param]: value };
            clear?.forEach(param => (params[param] = undefined));
            return editURL(location.href, params);
        }
        return this.getProperty('link');
    }

    getAriaCurrent() {
        if (this.isSelected()) return 'location';
        if (this.isSelectedLink()) return 'page';
    }

    // #endregion

    hasRouter() {
        return this.grabList()?.hasProperty('use-router') || this.hasAttribute('use-router');
    }

    isSelected() {
        return this.getProperty('selected');
    }

    isSelectedLink(memoized = true) {
        if (memoized && this._isSelectedLink) return this._isSelectedLink;
        if (this.link) {
            const paramName = this.getParamName();
            const paramValue = this.getParamValue();
            if (paramName && paramValue) {
                const currentParam = getURLParam(paramName);
                return currentParam === paramValue || (!currentParam && this.hasAttribute('default'));
            }
            const path = sanitizeURL(this.link);
            const currentPath = sanitizeURL(window.parent.location.href);
            this._isSelectedLink = path === currentPath;
            return this._isSelectedLink;
        }
        this._isSelectedLink = false;
        return false;
    }

    getDivider() {
        if (this.list) return this.list.getVariant() === 'horizontal' && this.getListDivider();
        return this._config?.divider;
    }

    getListDivider() {
        return this.list.hasZone('divider') || this.list?.getProperty('divider');
    }

    // #endregion Accessors

    //////////////////
    // #region Render
    /////////////////

    _initializeNodes() {
        this.nav = this.grabList();
        super._initializeNodes();
        this.linkNode = this.mainNode;
        attr(this.linkNode, {
            ...(this._config.handlerAttributes ?? {}),
            'aria-current': this.getAriaCurrent()
        });
        this._addTooltip();
        this._handleRouter();
        this._insertDivider();
        this._handleSelected();
        Context?.Router?.on('route_changed', this._onRouteChange);
    }

    _insertDivider() {
        if (this.dividerNode || !this.getDivider()) return;
        const isLastNode = this.nextElementSibling === null;
        if (!isLastNode) {
            this.dividerNode = this._renderDivider();
            this.after(this.dividerNode);
        }
    }

    _renderDivider() {
        const divider = this.getDivider();
        const node = document.createElement('span');
        node.classList.add('navLink__divider');
        typeof divider === 'string' && (node.textContent = divider);
        divider instanceof HTMLElement && (node.innerHTML = divider.innerHTML);
        return node;
    }

    _addTooltip() {
        const tooltip = this.getProperty('tooltip') || '';
        const tooltipZone = this.getZone('tooltip-content');
        if (tooltipZone || tooltip) {
            const position = this.getProperty('tooltip-position') || 'left';
            this.tooltip = renderNode(html`
                <arpa-tooltip handler="a" class="navLink__tooltip" position="${position}">
                    <zone name="tooltip-content">${tooltip}</zone>
                </arpa-tooltip>
            `);
            this.mainNode?.append(this.tooltip);
        }
    }

    // #endregion

    updateAriaCurrent() {
        this.linkNode && attr(this.linkNode, { 'aria-current': this.getAriaCurrent() });
    }

    //////////////////
    // #region events
    /////////////////

    _handleRouter() {
        if (this.hasRouter()) {
            this.linkNode?.removeEventListener('click', this._onHandleRouter);
            this.linkNode?.addEventListener('click', this._onHandleRouter);
        }
    }

    _handleSelected() {
        this.isSelectedLink(false) && this.nav?.onSelected(this);
    }

    _onRouteChange() {
        this._handleSelected();
        this.updateAriaCurrent();
    }

    _onHandleRouter(event) {
        event.preventDefault();
        Context.Router.go(this.getLink());
    }

    // #endregion
}

customElements.define('nav-link', NavLink);

export default NavLink;
