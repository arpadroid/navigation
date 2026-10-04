/**
 * @typedef {import('./navMenu.js').default} NavMenu
 * @typedef {import('../navButton/navButton.types').NavButtonConfigType} NavButtonConfigType
 * @typedef {import('@storybook/web-components-vite').Meta<NavButtonConfigType>} Meta
 * @typedef {import('@storybook/web-components-vite').StoryObj<NavButtonConfigType>} Story
 * @typedef {import('@storybook/web-components-vite').Args} Args
 */

import { expect, waitFor, userEvent } from 'storybook/test';
import { attrString } from '@arpadroid/tools';
import '../navButton/navButton.js';
import '../navLink/navLink.js';
import { defaultParams, testParams } from '@arpadroid/module/storybook/helper';

const html = String.raw;

/** @type {Meta} */
const NavMenuStory = {
    title: 'Navigation/Nav Menu',
    component: 'nav-menu',
    tags: [],
    parameters: {
        layout: 'padded'
    },
    args: {
        id: 'test-menu',
        label: 'Nav Menu'
    },
    // preprocessButton: (/** @type {HTMLButtonElement} */ button) => {
    //     console.log('preprocess', button);
    // },
    render: (/** @type {Args} */ args) => {
        return html`
            <nav-menu ${attrString(args)} preprocess-button=":preprocessButton">
                <template template-type="nav-button" style="border: 1px solid red;"></template>
                <template template-type="list-item" template-mode="append"> </template>
                <nav-button icon="People">
                    Nav Menu
                    <arpa-zone name="nav">
                        <nav-link link="/about" icon="info">About</nav-link>
                        <nav-link link="/team" icon="group">Team</nav-link>
                        <nav-link link="/careers" icon="work">Careers</nav-link>
                    </arpa-zone>
                </nav-button>

                <!--  <nav-button icon="shopping_bag">
                    Catalogue
                    <arpa-zone name="nav">
                        <nav-link link="/shop" icon="store">Shop</nav-link>
                        <nav-link link="/collections" icon="view_module">Collections</nav-link>
                        <nav-link link="/sales" icon="local_offer">Sales</nav-link>
                        <nav-link link="/auctions" icon="gavel">Auctions</nav-link>
                    </arpa-zone>
                </nav-button>

                <nav-button icon="support_agent">
                    Support
                    <arpa-zone name="nav">
                        <nav-link link="/help" icon="help">Help Center</nav-link>
                        <nav-link link="/contact" icon="contact_support">Contact Us</nav-link>
                        <nav-link link="/faq" icon="live_help">FAQ</nav-link>
                    </arpa-zone>
                </nav-button>

                <nav-button icon="account_circle">
                    Account
                    <arpa-zone name="nav">
                        <nav-link link="/profile" icon="person">Profile</nav-link>
                        <nav-link link="/settings" icon="settings">Settings</nav-link>
                        <nav-link link="/logout" icon="logout">Logout</nav-link>
                    </arpa-zone>
                </nav-button>
                -->
            </nav-menu>
        `;
    }
};

export const Render = {
    parameters: {
        layout: 'padded',
        ...defaultParams
    }
};

/** @type {Story} */
export const Test = {
    parameters: {
        layout: 'padded',
        ...testParams
    },
    beforeEach: async ({ canvasElement }) => {
        canvasElement.querySelector('nav-menu')?.remove();
        canvasElement.querySelector('nav-list')?.remove();
    },
    play: async ({ canvasElement, step, canvas }) => {
        const navMenu = /** @type {NavMenu} */ (canvasElement.querySelector('nav-menu'));
        await navMenu?.onRendered();

        await step('Renders the menu and items', async () => {
            await waitFor(() => {
                const button = canvas.getByRole('button', { name: /nav menu/i });
                expect(canvas.getByText('Nav Menu')).toBeInTheDocument();
                expect(button).toBeInTheDocument();
            });
        });

        await step('Click on the button and opens the navigation menu', async () => {
            const button = canvas.getByRole('button', { name: /nav menu/i });
            await userEvent.click(button);
            await waitFor(() => {
                expect(canvas.getByText('About')).toBeInTheDocument();
                expect(canvas.getByText('Team')).toBeInTheDocument();
                expect(canvas.getByText('Careers')).toBeInTheDocument();
            });
        });
    }
};

export default NavMenuStory;
