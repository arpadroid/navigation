/**
 * @typedef {import('@storybook/web-components-vite').StoryContext} StoryContext
 * @typedef {import('@storybook/web-components-vite').Args} Args
 * @typedef {import('./navButton.js').default} NavButton
 * @typedef {import('../navList/navList').default} NavList
 */

import { expect, waitFor, within } from 'storybook/test';

/**
 * Gets the default args for the nav button story.
 * @returns {Args}
 */
export function getArgs() {
    return {
        id: 'test-menu'
    };
}

/**
 * Gets the default arg types for the nav button story.
 * @param {string} [category]
 * @returns {import('@storybook/web-components-vite').ArgTypes}
 */
export function getArgTypes(category = 'Nav List Props') {
    return {
        id: { control: { type: 'text' }, table: { category } }
    };
}

/**
 * Sets up the play function for the nav button story.
 * @param {HTMLElement} canvasElement
 * @returns {Promise<{canvas: ReturnType<typeof within>, menuNode: NavButton | null, navigationNode: NavList | null}>}
 */
export async function playSetup(canvasElement) {
    const canvas = within(canvasElement);
    await waitFor(() => expect(canvasElement.querySelector('nav-list')).toBeInTheDocument());
    /** @type {NavButton | null} */
    const menuNode = canvasElement.querySelector('nav-button');
    /** @type {NavList | null} */
    const navigationNode = canvasElement.querySelector('nav-list');
    return { canvas, menuNode, navigationNode };
}
