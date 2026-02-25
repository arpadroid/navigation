/**
 * @typedef {import('@storybook/web-components-vite').Args} Args
 * @typedef {import('./sideNav.js').default} SideNav
 */

import { expect, waitFor, within } from 'storybook/test';

/**
 * Gets the default args for the side nav story.
 * @returns {Args}
 */
export function getArgs() {
    return {
        id: 'test-menu'
    };
}

/**
 * Gets the default arg types for the side nav story.
 * @param {string} [category]
 * @returns {import('@storybook/web-components-vite').ArgTypes}
 */
export function getArgTypes(category = 'Nav List Props') {
    return {
        id: { control: { type: 'text' }, table: { category } }
    };
}

/**
 * Sets up the play function for the side nav story.
 * @param {HTMLElement} canvasElement
 * @returns {Promise<{canvas: ReturnType<typeof within>, navNode: SideNav | null, navigationNode: SideNav | null}>}
 */
export async function playSetup(canvasElement) {
    const canvas = within(canvasElement);
    await waitFor(() => expect(canvasElement.querySelector('side-nav')).toBeInTheDocument());
    /** @type {SideNav | null} */
    const navNode = canvasElement.querySelector('side-nav');
    /** @type {SideNav | null} */
    const navigationNode = canvasElement.querySelector('side-nav');
    return { canvas, navNode, navigationNode };
}
