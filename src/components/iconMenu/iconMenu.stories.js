/**
 * @typedef {import('./iconMenu.js').default} IconMenu
 * @typedef {import('../navList/navList').default} NavList
 * @typedef {import('./iconMenu.types.js').IconMenuConfigType} IconMenuConfigType
 * @typedef {import('@storybook/web-components-vite').Meta<IconMenuConfigType>} Meta
 * @typedef {import('@storybook/web-components-vite').StoryObj<IconMenuConfigType>} Story
 */

import { expect, waitFor, userEvent } from 'storybook/test';
import { $attr } from '@arpadroid/tools';
import { defaultParams, testParams } from '@arpadroid/module/storybook/helper';

const html = String.raw;

/**
 * Sets up the play function for the icon menu story.
 * @param {HTMLElement} canvasElement
 * @returns {Promise<{menuNode: IconMenu | null, navigationNode: NavList | null}>}
 */
async function playSetup(canvasElement) {
    await waitFor(() => expect(canvasElement.querySelector('nav-list')).toBeInTheDocument());
    /** @type {IconMenu | null} */
    const menuNode = canvasElement.querySelector('icon-menu');
    /** @type {NavList | null} */
    const navigationNode = canvasElement.querySelector('nav-list');
    return { menuNode, navigationNode };
}

/** @type {Meta} */
const IconMenuStory = {
    component: 'icon-menu',
    title: 'Navigation/Icon Menu',
    tags: [],
    render: args => {
        return html`
            <div class="container" style="display:flex; width: 100%;">
                <icon-menu ${$attr(args)}>
                    <!-- @todo: remove the need to have this zone -->
                    <arpa-zone name="nav">
                        <nav-link link="/home" icon="home">Home</nav-link>
                        <nav-link link="/settings" icon="settings">Settings</nav-link>
                        <nav-link link="/user" icon="smart_toy">User</nav-link>
                    </arpa-zone>
                </icon-menu>
            </div>
        `;
    }
};

/** @type {Story} */
export const Default = {
    name: 'Render',
    parameters: defaultParams,
    args: { id: 'test-menu' }
};

/** @type {Story} */
export const Test = {
    args: {
        ...Default.args
    },
    parameters: testParams,
    play: async ({ canvas, canvasElement, step }) => {
        const { menuNode, navigationNode } = await playSetup(canvasElement);
        await step('Renders the menu', async () => {
            await menuNode?.promise;
            expect(menuNode).toBeTruthy();
            expect(navigationNode).not.toBeVisible();

            await waitFor(() => {
                expect(canvas.getByText('Home')).toBeInTheDocument();
                expect(canvas.getByText('Settings')).toBeInTheDocument();
                expect(canvas.getByText('User')).toBeInTheDocument();
            });
        });

        await step('Opens the menu', async () => {
            canvas.getByRole('button').click();
            await waitFor(() => expect(navigationNode).toBeVisible());
        });

        await step('Closes the menu', async () => {
            await new Promise(resolve => setTimeout(resolve, 200));
            await userEvent.click(document.body);
            await waitFor(() => {
                expect(navigationNode).not.toBeVisible();
            });
        });
    }
};

/** @type {Meta} */
export default IconMenuStory;
