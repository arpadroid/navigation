/**
 * @typedef {import('@storybook/web-components-vite').StoryContext} StoryContext
 * @typedef {import('@storybook/web-components-vite').Args} Args
 * @typedef {import('./iconMenu.js').default} IconMenu
 * @typedef {import('../navList/navList').default} NavList
 */

import { expect, waitFor, within } from 'storybook/test';

/**
 * Gets the default args for the icon menu story.
 * @returns {Args}
 */
export function getArgs() {
    return {
        id: 'test-menu'
    };
}

/**
 * Gets the default arg types for the icon menu story.
 * @param {string} [category]
 * @returns {import('@storybook/web-components-vite').ArgTypes}
 */
export function getArgTypes(category = 'Nav List Props') {
    return {
        id: { control: { type: 'text' }, table: { category } }
    };
}

/**
 * Sets up the play function for the icon menu story.
 * @param {HTMLElement} canvasElement
 * @returns {Promise<{canvas: ReturnType<typeof within>, menuNode: IconMenu | null, navigationNode: NavList | null}>}
 */
export async function playSetup(canvasElement) {
    const canvas = within(canvasElement);
    await waitFor(() => expect(canvasElement.querySelector('nav-list')).toBeInTheDocument());
    /** @type {IconMenu | null} */
    const menuNode = canvasElement.querySelector('icon-menu');

    /** @type {NavList | null} */
    const navigationNode = canvasElement.querySelector('nav-list');
    return { canvas, menuNode, navigationNode };
}
