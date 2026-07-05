/**
 * @typedef {import('./navList.types.js').NavListConfigType} NavListConfigType
 * @typedef {import('@storybook/web-components-vite').Meta<NavListConfigType>} Meta
 * @typedef {import('@storybook/web-components-vite').StoryObj<NavListConfigType>} Story
 */

import { expect, waitFor, userEvent } from 'storybook/test';
import { attrString, editURL } from '@arpadroid/tools';
import { playSetup, createTestLinks } from './navList.stories.util.js';
import { defaultParams, testParams } from '@arpadroid/module/storybook/helper';

const html = String.raw;

/** @type {Meta} */
const NavListStory = {
    title: 'Navigation/Nav List',
    component: 'nav-list',
    tags: [],
    parameters: {
        layout: 'padded'
    },
    render: args => {
        const url = window.parent.location.href;
        return html`
            <nav-list ${attrString(args)}>
                <nav-link link="${editURL(url, { section: 'home' }, false)}" icon="home">Home</nav-link>
                <nav-link link="${editURL(url, { section: 'settings' }, false)}" icon="settings">
                    Settings
                </nav-link>
                <nav-link link="${editURL(url, { section: 'user' }, false)}" icon="person">User</nav-link>
                <nav-link icon="logout">Logout</nav-link>
                <nav-link icon="smart_toy">No action</nav-link>
            </nav-list>
        `;
    }
};

/** @type {Story} */
export const Default = {
    name: 'Vertical',
    parameters: defaultParams,
    args: { id: 'nav-list', variant: 'vertical' }
};

/** @type {Story} */
export const Horizontal = {
    name: 'Horizontal',
    parameters: testParams,
    args: {
        id: 'nav-list',
        variant: 'horizontal',
        divider: '|'
    }
};

/** @type {Story} */
export const HorizontalWithZoneDivider = {
    parameters: testParams,
    args: {
        id: 'nav-list',
        variant: 'horizontal'
    },
    render: args => {
        const url = window.parent.location.href;
        const homeURL = editURL(url, { section: 'home' }, false);
        const settingsURL = editURL(url, { section: 'settings' }, false);
        const userURL = editURL(url, { section: 'user' }, false);
        return html`
            <nav-list ${attrString(args)}>
                <arpa-zone name="divider">
                    <arpa-icon style="font-size: 22px;">more_vert</arpa-icon>
                </arpa-zone>
                <nav-link link="${homeURL}" icon="home">Home</nav-link>
                <nav-link link="${settingsURL}" icon="settings">Settings</nav-link>
                <nav-link link="${userURL}" icon="person">User</nav-link>
            </nav-list>
        `;
    }
};

/** @type {Story} */
export const Test = {
    args: {
        id: 'nav-list'
    },
    render: args => {
        const url = editURL(window.parent.location.href, { section: 'test' }, false);
        return html`
            <nav-list ${attrString(args)}>
                <nav-link link="${url}" icon="home">Test Link</nav-link>
            </nav-list>
        `;
    },
    parameters: testParams,
    play: async ({ canvasElement, step }) => {
        const { canvas, listNode } = await playSetup(canvasElement);
        await step('Renders the list', async () => {
            await waitFor(() => {
                expect(listNode).toBeTruthy();
                expect(canvas.getByText('Test Link')).toBeInTheDocument();
            });
        });

        await step('Adds new links to the list and verifies logout action callback', async () => {
            if (!listNode) return;
            const { logoutAction } = createTestLinks(listNode);
            await waitFor(() => {
                expect(canvas.getByText('Settings')).toBeInTheDocument();
                expect(canvas.getByText('User')).toBeInTheDocument();
                expect(canvas.getByText('Logout')).toBeInTheDocument();
            });
            const logoutButton = await waitFor(() => canvas.getByRole('button'));
            await userEvent.click(logoutButton);
            await waitFor(() => {
                expect(logoutAction).toHaveBeenCalled();
            });
        });
    }
};

/** @type {Meta} */
export default NavListStory;
