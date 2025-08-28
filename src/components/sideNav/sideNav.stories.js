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
        layout: 'fullscreen'
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
                <zone name="title">Test Menu</zone>
                <zone name="headerContent"
                    >Nature is fascinating, <strong>and so is technology!</strong></zone
                >
                <zone name="links">
                    <nav-link link="/dashboard" icon="dashboard"> Dashboard </nav-link>
                    <nav-button nav-type="combo" icon="art_track" button-label="Inventory">
                        <nav-link link="/all-works" icon="brush">All Works</nav-link>
                        <nav-link link="/editions" icon="book">Editions</nav-link>
                        <nav-link link="/consignments" icon="inventory">Consignments</nav-link>
                        <nav-link link="/artists" icon="people">Artists</nav-link>
                        <nav-link link="/archive" icon="archive">Archive</nav-link>
                    </nav-button>
                </zone>
                <zone name="footerContent">
                    There are other fascinating things too, like
                    <a href="https://arpadroid.com" target="_blank" rel="noreferrer">Arpadroid</a>.
                </zone>
                <!-- some content -->
            </side-nav>
        `;
    }
};

export const Default = {
    name: 'Render',
    parameters: {},
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
    },
    play: async ({ canvasElement, step }) => {
        const setup = await Test.playSetup(canvasElement);
        // const { canvas, menuNode, navigationNode } = setup;
        await step('Renders the menu', async () => {
            // await navNode.load;
        });
    }
};

export default SideNavStory;
