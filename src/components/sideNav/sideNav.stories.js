/**
 * @typedef {import('@storybook/web-components-vite').Meta} Meta
 * @typedef {import('@storybook/web-components-vite').StoryObj} StoryObj
 * @typedef {import('./sideNav.js').default} SideNav
 */

import { attrString } from '@arpadroid/tools';
import { expect, waitFor } from 'storybook/test';
import { testParams } from '@arpadroid/module/storybook/helper';

const html = String.raw;

/** @type {Meta} */
const SideNavStory = {
    component: 'side-nav',
    title: 'Navigation/Side Nav',
    tags: [],
    parameters: {
        layout: 'flexColumn'
    },
    render: args => {
        delete args.text;
        return html`
            <side-nav ${attrString(args)}>
                <arpa-zone name="title">Side Navigation</arpa-zone>
                <arpa-zone name="headerContent">
                    <p>Nature is fascinating, <strong>and so is technology!</strong></p>
                </arpa-zone>
                <arpa-zone name="links">
                    <template template-type="nav-link" icon-right="link"></template>
                    <nav-link link="/dashboard" icon="dashboard">Dashboard</nav-link>
                    <side-nav-button icon="art_track">
                        Inventory
                        <arpa-zone name="nav">
                            <nav-link link="/all-works" icon="brush">All Works</nav-link>
                            <nav-link link="/editions" icon="book">Editions</nav-link>
                            <nav-link link="/consignments" icon="inventory">Consignments</nav-link>
                            <nav-link link="/archive" icon="archive">Archive</nav-link>
                        </arpa-zone>
                    </side-nav-button>
                    <side-nav-button icon="people">
                        Artists
                        <arpa-zone name="nav">
                            <nav-link link="/artists" icon="people">All</nav-link>
                            <nav-link link="/artists/new" icon="add">New</nav-link>
                            <nav-link link="/artists/active" icon="account_circle">Active</nav-link>
                            <nav-link link="/artists/disabled" icon="account_circle_off">Disabled</nav-link>
                        </arpa-zone>
                    </side-nav-button>
                    <side-nav-button icon="event">
                        Exhibitions
                        <arpa-zone name="nav">
                            <nav-link link="/exhibitions" icon="event">All</nav-link>
                            <nav-link link="/exhibitions/new" icon="add">New</nav-link>
                            <nav-link link="/exhibitions/active" icon="check_circle">Active</nav-link>
                            <nav-link link="/exhibitions/disabled" icon="cancel">Disabled</nav-link>
                        </arpa-zone>
                    </side-nav-button>
                    <side-nav-button icon="contact_mail">
                        Contacts
                        <arpa-zone name="nav">
                            <nav-link link="/contacts" icon="contact_mail">All</nav-link>
                            <nav-link link="/contacts/new" icon="add">New</nav-link>
                            <nav-link link="/contacts/active" icon="check_circle">Active</nav-link>
                            <nav-link link="/contacts/archived" icon="cancel">Archived</nav-link>
                        </arpa-zone>
                    </side-nav-button>
                    <side-nav-button icon="category">
                        Categories
                        <arpa-zone name="nav">
                            <nav-link link="/categories" icon="category">All</nav-link>
                            <nav-link link="/categories/new" icon="add">New</nav-link>
                            <nav-link link="/categories/active" icon="check_circle">Active</nav-link>
                            <nav-link link="/categories/archived" icon="cancel">Archived</nav-link>
                        </arpa-zone>
                    </side-nav-button>

                    <side-nav-button icon="sell">
                        Sales
                        <arpa-zone name="nav">
                            <nav-link link="/sales" icon="sell">All Sales</nav-link>
                            <nav-link link="/sales/new" icon="add">New</nav-link>
                            <nav-link link="/sales/active" icon="check_circle">Active</nav-link>
                            <nav-link link="/sales/archived" icon="cancel">Archived</nav-link>
                        </arpa-zone>
                    </side-nav-button>

                    <side-nav-button icon="settings">
                        Admin
                        <arpa-zone name="nav">
                            <nav-link link="/admin" icon="settings">All Settings</nav-link>
                            <nav-link link="/admin/users" icon="people">Users</nav-link>
                            <nav-link link="/admin/roles" icon="security">Roles</nav-link>
                        </arpa-zone>
                    </side-nav-button>
                </arpa-zone>

                <arpa-zone name="footerContent">
                    <p>
                        There are other fascinating things too, like
                        <a href="https://arpadroid.com" target="_blank" rel="noreferrer">Arpadroid</a>.
                    </p>
                </arpa-zone>
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

    args: { id: 'test-side-nav' }
};

/** @type {StoryObj} */
export const Test = {
    args: {
        id: 'test-side-nav'
    },
    parameters: testParams,
    play: async ({ canvasElement, step }) => {
        await waitFor(() => canvasElement.querySelector('side-nav'));
        /** @type {SideNav | null} */
        const navNode = canvasElement.querySelector('side-nav');
        await step('Renders the menu', async () => {
            expect(navNode).toBeInTheDocument();
        });
    }
};

export default SideNavStory;
