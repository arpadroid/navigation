/**
 * @typedef {import('../navList/navList').default} NavList
 * @typedef {import('@storybook/web-components-vite').Meta} Meta
 * @typedef {import('@storybook/web-components-vite').StoryObj} StoryObj
 * @typedef {import('@storybook/web-components-vite').StoryContext} StoryContext
 * @typedef {import('@storybook/web-components-vite').Args} Args
 * @typedef {import('./navMenu.js').default} NavMenu
 */

import { expect, waitFor, within } from 'storybook/test';
import { attrString } from '@arpadroid/tools';

const html = String.raw;

/** @type {Meta} */
const NavMenuStory = {
    title: 'Navigation/Nav Menu',
    tags: [],
    parameters: {
        layout: 'padded'
    },
    args: {
        id: 'test-menu',
        title: 'Nav Menu'
    },
    preprocessButton: (/** @type {HTMLButtonElement} */ button) => {
        console.log('preprocess', button);
    },
    render: (/** @type {Args} */ args) => {
        return html`
            <nav-menu ${attrString(args)} preprocess-button=":preprocessButton">
                <template template-type="nav-button" style="border: 1px solid red;"></template>
                <template template-type="list-item" template-mode="append"> </template>
                <nav-button icon="People">
                    About Us
                    <nav-link link="/about" icon="info">About</nav-link>
                    <nav-link link="/team" icon="group">Team</nav-link>
                    <nav-link link="/careers" icon="work">Careers</nav-link>
                </nav-button>

                <!-- <nav-button icon="shopping_bag">
                    Catalogue
                    <nav-link link="/shop" icon="store">Shop</nav-link>
                    <nav-link link="/collections" icon="view_module">Collections</nav-link>
                    <nav-link link="/sales" icon="local_offer">Sales</nav-link>
                    <nav-link link="/auctions" icon="gavel">Auctions</nav-link>
                </nav-button>

                <nav-button icon="support_agent">
                    Support
                    <nav-link link="/help" icon="help">Help Center</nav-link>
                    <nav-link link="/contact" icon="contact_support">Contact Us</nav-link>
                    <nav-link link="/faq" icon="live_help">FAQ</nav-link>
                </nav-button>

                <nav-button icon="account_circle">
                    Account
                    <nav-link link="/profile" icon="person">Profile</nav-link>
                    <nav-link link="/settings" icon="settings">Settings</nav-link>
                    <nav-link link="/logout" icon="logout">Logout</nav-link>
                </nav-button>
            </nav-menu> -->
            </nav-menu>
        `;
    },
    playSetup: async (/** @type {HTMLElement} */ canvasElement) => {
        const canvas = within(canvasElement);
        await waitFor(() => expect(canvasElement.querySelector('nav-menu')).toBeInTheDocument());
        await customElements.whenDefined('nav-menu');
        const navMenu = /** @type {NavMenu} */ (canvasElement.querySelector('nav-menu'));
        await navMenu?.promise;
        return { canvas, navMenu, resource: navMenu?.listResource };
    },
    play: async (/** @type {StoryContext} */ { canvasElement, step }) => {
        const { canvas, navMenu, resource } = await NavMenuStory.playSetup(canvasElement);
        await step('Renders the menu and items', async () => {
            expect(canvas.getByText('Nav Menu')).toBeInTheDocument();
            expect(navMenu).toBeInTheDocument();
            const items = resource?.getItems();
            await waitFor(() => expect(items && items.length).toBeGreaterThan(0));
        });
    }
};

/** @type {StoryObj} */
export const Default = {
    name: 'Render',
    parameters: {
        layout: 'padded'
    }
};

/** @type {Meta} */
export default NavMenuStory;
