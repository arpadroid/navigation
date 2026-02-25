/**
 * @typedef {import('@storybook/web-components-vite').StoryContext} StoryContext
 * @typedef {import('@storybook/web-components-vite').Args} Args
 * @typedef {import('./navList.js').default} NavList
 */

import { expect, fn, waitFor, within } from 'storybook/test';
import { editURL } from '@arpadroid/tools';

/**
 * Gets the default args for the nav list story.
 * @returns {Args}
 */
export function getArgs() {
    return {
        id: 'nav-list',
        divider: '',
        variant: ''
    };
}

/**
 * Gets the default arg types for the nav list story.
 * @param {string} [category]
 * @returns {import('@storybook/web-components-vite').ArgTypes}
 */
export function getArgTypes(category = 'Nav List Props') {
    return {
        id: { control: { type: 'text' }, table: { category } },
        divider: { control: { type: 'text' }, table: { category } },
        variant: {
            options: ['horizontal', 'vertical', ''],
            control: { type: 'select' },
            table: { category }
        }
    };
}

/**
 * Sets up the play function for the nav list story.
 * @param {HTMLElement} canvasElement
 * @returns {Promise<{canvas: ReturnType<typeof within>, listNode: NavList | null}>}
 */
export async function playSetup(canvasElement) {
    const canvas = within(canvasElement);
    await customElements.whenDefined('nav-list');
    /** @type {NavList | null} */
    const listNode = canvasElement.querySelector('nav-list');
    return { canvas, listNode };
}

/**
 * Creates test links for a nav list.
 * @param {NavList} list
 * @returns {{ logoutAction: ReturnType<typeof fn> }}
 */
export function createTestLinks(list) {
    const url = window.parent.location.href;
    const logoutAction = fn();
    list.setItems([
        {
            content: 'Settings',
            icon: 'settings',
            link: editURL(url, { section: 'settings' })
        },
        {
            content: 'User',
            icon: 'smart_toy',
            link: editURL(url, { section: 'user' })
        },
        {
            content: 'Logout',
            icon: 'logout',
            action: logoutAction
        }
    ]);
    return { logoutAction };
}
