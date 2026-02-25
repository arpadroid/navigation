/**
 * @typedef {import('@storybook/web-components-vite').Meta} Meta
 * @typedef {import('@storybook/web-components-vite').StoryObj} StoryObj
 * @typedef {import('@storybook/web-components-vite').Args} Args
 */

import { attrString } from '@arpadroid/tools';
import { getArgs, getArgTypes, playSetup } from './sideNav.stories.util.js';

const html = String.raw;

/** @type {Meta} */
const SideNavStory = {
    title: 'Navigation/Side Nav',
    tags: [],
    parameters: {
        layout: 'flexColumn'
    },
    render: (/** @type {Args} */ args) => {
        delete args.text;
        return html`
            <side-nav ${attrString(args)}>
                <zone name="title">Side Navigation</zone>
                <zone name="headerContent">
                    <p>Nature is fascinating, <strong>and so is technology!</strong></p>
                </zone>
                <zone name="links">
                    <template template-type="nav-link" icon-right="link"></template>
                    <nav-link link="/dashboard" icon="dashboard">Dashboard</nav-link>
                    <side-nav-button icon="art_track">
                        Inventory
                        <nav-link link="/all-works" icon="brush">All Works</nav-link>
                        <nav-link link="/editions" icon="book">Editions</nav-link>
                        <nav-link link="/consignments" icon="inventory">Consignments</nav-link>
                        <nav-link link="/archive" icon="archive">Archive</nav-link>
                    </side-nav-button>
                    <side-nav-button icon="people">
                        Artists
                        <nav-link link="/artists" icon="people">All</nav-link>
                        <nav-link link="/artists/new" icon="add">New</nav-link>
                        <nav-link link="/artists/active" icon="account_circle">Active</nav-link>
                        <nav-link link="/artists/disabled" icon="account_circle_off">Disabled</nav-link>
                    </side-nav-button>
                    <side-nav-button icon="event">
                        Exhibitions
                        <nav-link link="/exhibitions" icon="event">All</nav-link>
                        <nav-link link="/exhibitions/new" icon="add">New</nav-link>
                        <nav-link link="/exhibitions/active" icon="check_circle">Active</nav-link>
                        <nav-link link="/exhibitions/disabled" icon="cancel">Disabled</nav-link>
                    </side-nav-button>
                    <side-nav-button icon="contact_mail">
                        Contacts
                        <nav-link link="/contacts" icon="contact_mail">All</nav-link>
                        <nav-link link="/contacts/new" icon="add">New</nav-link>
                        <nav-link link="/contacts/active" icon="check_circle">Active</nav-link>
                        <nav-link link="/contacts/archived" icon="cancel">Archived</nav-link>
                    </side-nav-button>
                    <side-nav-button icon="category">
                        Categories
                        <nav-link link="/categories" icon="category">All</nav-link>
                        <nav-link link="/categories/new" icon="add">New</nav-link>
                        <nav-link link="/categories/active" icon="check_circle">Active</nav-link>
                        <nav-link link="/categories/archived" icon="cancel">Archived</nav-link>
                    </side-nav-button>

                    <side-nav-button icon="sell">
                        Sales
                        <nav-link link="/sales" icon="sell">All Sales</nav-link>
                        <nav-link link="/sales/new" icon="add">New</nav-link>
                        <nav-link link="/sales/active" icon="check_circle">Active</nav-link>
                        <nav-link link="/sales/archived" icon="cancel">Archived</nav-link>
                    </side-nav-button>

                    <side-nav-button icon="settings">
                        Admin
                        <nav-link link="/admin" icon="settings">All Settings</nav-link>
                        <nav-link link="/admin/users" icon="people">Users</nav-link>
                        <nav-link link="/admin/roles" icon="security">Roles</nav-link>
                    </side-nav-button>
                </zone>

                <zone name="footerContent">
                    <p>
                        There are other fascinating things too, like
                        <a href="https://arpadroid.com" target="_blank" rel="noreferrer">Arpadroid</a>.
                    </p>
                </zone>
                <!-- some content -->
            </side-nav>
        `;
    }
};

/** @type {StoryObj} */
export const Default = {
    name: 'Render',
    parameters: {
        layout: 'flexColumn'
    },
    argTypes: getArgTypes(),
    args: { ...getArgs() }
};

/** @type {StoryObj} */
export const Test = {
    args: {
        ...Default.args
    },
    parameters: {
        controls: { disable: true },
        usage: { disable: true },
        options: { selectedPanel: 'storybook/interactions/panel' }
    }
    // playSetup,
    // play: async ({ canvasElement, step }) => {
    //     const setup = await playSetup(canvasElement);
    //     // const { canvas, menuNode, navigationNode } = setup;
    //     await step('Renders the menu', async () => {
    //         // await navNode.load;
    //     });
    // }
};

export default SideNavStory;
