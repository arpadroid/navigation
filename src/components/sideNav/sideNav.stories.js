/**
 * @typedef {import('./navList.js').default} NavList
 */
import { attrString } from '@arpadroid/tools';
import { expect, waitFor, within } from '@storybook/test';

const html = String.raw;
const SideNavStory = {
    title: 'Navigation/Side Nav',
    tags: [],
    parameters: {
        layout: 'flexColumn'
    },
    getArgs: () => {
        return {
            id: 'test-menu'
        };
    },
    getArgTypes: (category = 'Nav List Props') => {
        return {
            id: { control: { type: 'text' }, table: { category } }
        };
    },
    render: args => {
        delete args.text;
        return html`
            <side-nav ${attrString(args)}>
                <zone name="title">Side Navigation</zone>
                <zone name="headerContent">
                    <p>Nature is fascinating, <strong>and so is technology!</strong></p>
                </zone>
                <zone name="links">
                    <nav-link link="/dashboard" icon="dashboard">Dashboard</nav-link>
                    <nav-button icon="art_track" button-label="Inventory">
                        <nav-link link="/all-works" icon="brush">All Works</nav-link>
                        <nav-link link="/editions" icon="book">Editions</nav-link>
                        <nav-link link="/consignments" icon="inventory">Consignments</nav-link>
                        <nav-link link="/archive" icon="archive">Archive</nav-link>
                    </nav-button>
                    <nav-button button-label="Artists" icon="people">
                        <nav-link link="/artists" icon="people">All</nav-link>
                        <nav-link link="/artists/new" icon="add">New</nav-link>
                        <nav-link link="/artists/active" icon="account_circle">Active</nav-link>
                        <nav-link link="/artists/disabled" icon="account_circle_off">Disabled</nav-link>
                    </nav-button>
                    <nav-button button-label="Exhibitions" icon="event">
                        <nav-link link="/exhibitions" icon="event">All</nav-link>
                        <nav-link link="/exhibitions/new" icon="add">New</nav-link>
                        <nav-link link="/exhibitions/active" icon="check_circle">Active</nav-link>
                        <nav-link link="/exhibitions/disabled" icon="cancel">Disabled</nav-link>
                    </nav-button>
                    <nav-button button-label="Contacts" icon="contact_mail">
                        <nav-link link="/contacts" icon="contact_mail">All</nav-link>
                        <nav-link link="/contacts/new" icon="add">New</nav-link>
                        <nav-link link="/contacts/active" icon="check_circle">Active</nav-link>
                        <nav-link link="/contacts/archived" icon="cancel">Archived</nav-link>
                    </nav-button>
                    <nav-button button-label="Categories" icon="category">
                        <nav-link link="/categories" icon="category">All</nav-link>
                        <nav-link link="/categories/new" icon="add">New</nav-link>
                        <nav-link link="/categories/active" icon="check_circle">Active</nav-link>
                        <nav-link link="/categories/archived" icon="cancel">Archived</nav-link>
                    </nav-button>

                    <nav-button button-label="Sales" icon="sell">
                        <nav-link link="/sales" icon="sell">All Sales</nav-link>
                        <nav-link link="/sales/new" icon="add">New</nav-link>
                        <nav-link link="/sales/active" icon="check_circle">Active</nav-link>
                        <nav-link link="/sales/archived" icon="cancel">Archived</nav-link>
                    </nav-button>

                    <nav-button button-label="Admin" icon="settings">
                        <nav-link link="/admin" icon="settings">All Settings</nav-link>
                        <nav-link link="/admin/users" icon="people">Users</nav-link>
                        <nav-link link="/admin/roles" icon="security">Roles</nav-link>
                    </nav-button>
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

export const Default = {
    name: 'Render',
    parameters: {
        layout: 'flexColumn'
    },
    argTypes: SideNavStory.getArgTypes(),
    args: { ...SideNavStory.getArgs() }
};

export const Test = {
    args: Default.args,
    parameters: {},
    args: {
        ...Default.args
    },
    parameters: {
        controls: { disable: true },
        usage: { disable: true },
        options: { selectedPanel: 'storybook/interactions/panel' }
    },
    playSetup: async canvasElement => {
        const canvas = within(canvasElement);
        await waitFor(() => expect(canvasElement.querySelector('side-nav')).toBeInTheDocument());
        const navNode = canvasElement.querySelector('side-nav');
        const navigationNode = canvasElement.querySelector('side-nav');
        return { canvas, navNode, navigationNode };
    }
    // play: async ({ canvasElement, step }) => {
    //     const setup = await Test.playSetup(canvasElement);
    //     // const { canvas, menuNode, navigationNode } = setup;
    //     await step('Renders the menu', async () => {
    //         // await navNode.load;
    //     });
    // }
};

export default SideNavStory;
