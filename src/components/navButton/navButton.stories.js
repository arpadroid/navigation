/**
 * @typedef {import('../navList/navList').default} NavList
 * @typedef {import('@storybook/web-components-vite').Meta} Meta
 * @typedef {import('@storybook/web-components-vite').StoryObj} StoryObj
 * @typedef {import('@storybook/web-components-vite').StoryContext} StoryContext
 * @typedef {import('@storybook/web-components-vite').Args} Args
 */

import { expect, fireEvent, waitFor, within } from 'storybook/test';
import { attrString } from '@arpadroid/tools';

const html = String.raw;


/** @type {Meta} */
const NavButtonStory = {
    title: 'Navigation/Nav Button',
    tags: [],
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
    render: (/** @type {Args} */ args) => {
        delete args.text;
        return html`
            <div class="container" style="display:flex; width: 100%;">
                <nav-button ${attrString(args)}>
                    Button Menu 
                    <nav-link link="/home" icon="home">Home</nav-link>
                    <nav-link link="/settings" icon="settings">Settings</nav-link>
                    <nav-link link="/user" icon="smart_toy">User</nav-link>
                </nav-button>
            </div>
        `;
    }
};

/** @type {StoryObj} */
export const Default = {
    name: 'Render',
    parameters: {},
    argTypes: NavButtonStory.getArgTypes(),
    args: { ...NavButtonStory.getArgs() }
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
    },
    playSetup: async (/** @type {HTMLElement} */ canvasElement) => {
        const canvas = within(canvasElement);
        await waitFor(() => expect(canvasElement.querySelector('nav-list')).toBeInTheDocument());
        const menuNode = canvasElement.querySelector('nav-button');
        const navigationNode = canvasElement.querySelector('nav-list');
        return { canvas, menuNode, navigationNode };
    },
    play: async (/** @type {StoryContext} */ { canvasElement, step }) => {
        const setup = await Test.playSetup(canvasElement);
        const { canvas, menuNode, navigationNode } = setup;
        await step('Renders the menu', async () => {
            await menuNode.load;
            expect(menuNode).toBeTruthy();
            expect(navigationNode).not.toBeVisible();
            /**
             * @todo Fix flaky test, would not pass in CI.
             */
            await waitFor(() => {
                expect(canvas.getByText('Home')).toBeInTheDocument();
                expect(canvas.getByText('Settings')).toBeInTheDocument();
                expect(canvas.getByText('User')).toBeInTheDocument();
            });
        });

        await step('Opens the menu', async () => {
            await new Promise(resolve => setTimeout(resolve, 100));
            canvas.getByRole('button').click();
            await waitFor(() => expect(navigationNode).toBeVisible());
        });

        await step('Closes the menu', async () => {
            await new Promise(resolve => setTimeout(resolve, 100));
            await fireEvent.click(canvas.getByRole('button'));
            await waitFor(() => {
                expect(navigationNode).not.toBeVisible();
            });
        });
    }
};

/** @type {Meta} */
export default NavButtonStory;
