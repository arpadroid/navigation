/**
 * @typedef {import('./navButton.types').NavButtonConfigType} NavButtonConfigType
 * @typedef {import('../navLink/navLink.types').NavLinkConfigType} NavLinkConfigType
 * @typedef {import('@arpadroid/lists').ListItem} ListItem
 * @typedef {import('../navList/navList.js').default} NavList
 * @typedef {import('@storybook/web-components-vite').Meta<NavButtonConfigType>} Meta
 * @typedef {import('@storybook/web-components-vite').StoryObj<NavButtonConfigType>} Story
 */

import { expect, fireEvent, waitFor } from 'storybook/test';
import { attrString } from '@arpadroid/tools';
import { getArgs, getArgTypes, playSetup } from './navButton.stories.util.js';
import { defaultParams, testParams } from '@arpadroid/module/storybook/helper';

const html = String.raw;

/** @type {Meta} */
const NavButtonStory = {
    component: 'nav-button',
    title: 'Navigation/Nav Button',
    tags: [],
    render: args => {
        return html`<div class="container" style="display:flex; width: 100%;">
            <nav-button ${attrString(args)}>
                Menu
                <arpa-zone name="nav">
                    <nav-link link="/home" icon="home">Home</nav-link>
                    <nav-link link="/settings" icon="settings">Settings</nav-link>
                    <nav-link link="/user" icon="smart_toy">User</nav-link>
                </arpa-zone>
            </nav-button>
        </div>`;
    }
};

/** @type {Story} */
export const Default = {
    name: 'Render',
    parameters: defaultParams,
    argTypes: getArgTypes(),
    args: { ...getArgs() }
};

/** @type {Story} */
export const Test = {
    args: {
        ...Default.args
    },
    parameters: testParams,
    play: async ({ canvasElement, step }) => {
        const setup = await playSetup(canvasElement);
        const { canvas, menuNode, navigationNode } = setup;
        await step('Renders the menu', async () => {
            await menuNode?.promise;
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
