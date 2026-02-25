/**
 * @typedef {import('@storybook/web-components-vite').Meta} Meta
 * @typedef {import('@storybook/web-components-vite').StoryObj} StoryObj
 * @typedef {import('@storybook/web-components-vite').Args} Args
 */

import { expect, waitFor } from 'storybook/test';
import { attrString, editURL } from '@arpadroid/tools';
import { getArgs, getArgTypes, playSetup, createTestLinks } from './navList.stories.util.js';

const html = String.raw;

/** @type {Meta} */
const NavListStory = {
    title: 'Navigation/Nav List',
    tags: [],
    parameters: {
        layout: 'padded'
    },
    render: args => {
        delete args.text;
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

/** @type {StoryObj} */
export const Default = {
    name: 'Vertical',
    parameters: {},
    argTypes: getArgTypes(),
    args: { ...getArgs(), id: 'nav-list', variant: 'vertical' }
};

/** @type {StoryObj} */
export const Horizontal = {
    name: 'Horizontal',
    parameters: {},
    argTypes: getArgTypes(),
    args: {
        ...getArgs(),
        variant: 'horizontal',
        divider: '|'
    }
};

/** @type {StoryObj} */
export const HorizontalWithZoneDivider = {
    parameters: {},
    argTypes: getArgTypes(),
    args: {
        ...getArgs(),
        variant: 'horizontal'
    },
    render: (/** @type {Args} */ args) => {
        delete args.text;
        const url = window.parent.location.href;
        const homeURL = editURL(url, { section: 'home' }, false);
        const settingsURL = editURL(url, { section: 'settings' }, false);
        const userURL = editURL(url, { section: 'user' }, false);
        return html`
            <nav-list ${attrString(args)}>
                <zone name="divider">
                    <arpa-icon style="font-size: 22px;">more_vert</arpa-icon>
                </zone>
                <nav-link link="${homeURL}" icon="home">Home</nav-link>
                <nav-link link="${settingsURL}" icon="settings">Settings</nav-link>
                <nav-link link="${userURL}" icon="person">User</nav-link>
            </nav-list>
        `;
    }
};

/** @type {StoryObj} */
export const Test = {
    args: {
        ...Default.args
    },
    render: (/** @type {Args} */ args) => {
        delete args.text;
        const url = editURL(window.parent.location.href, { section: 'test' }, false);
        return html`
            <nav-list ${attrString(args)}>
                <nav-link link="${url}" icon="home">Test Link</nav-link>
            </nav-list>
        `;
    },
    parameters: {
        controls: { disable: true },
        usage: { disable: true },
        options: { selectedPanel: 'storybook/interactions/panel' }
    },
    play: async ({ canvasElement, step }) => {
        const { canvas, listNode } = await playSetup(canvasElement);
        await step('Renders the list', () => {
            expect(listNode).toBeTruthy();
            expect(canvas.getByText('Test Link')).toBeInTheDocument();
        });

        await step('Adds new links to the list and verifies logout action callback', async () => {
            if (!listNode) return;
            const { logoutAction } = createTestLinks(listNode);
            await waitFor(() => {
                expect(canvas.getByText('Settings')).toBeInTheDocument();
                expect(canvas.getByText('User')).toBeInTheDocument();
                expect(canvas.getByText('Logout')).toBeInTheDocument();
            });
            const logoutButton = canvas.getByText('Logout').closest('button');
            requestAnimationFrame(() => logoutButton.click());

            await waitFor(() => {
                expect(logoutAction).toHaveBeenCalled();
            });
        });
    }
};

/** @type {Meta} */
export default NavListStory;
