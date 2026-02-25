/**
 * @typedef {import('@storybook/web-components-vite').Args} Args
 * @typedef {import('./navMenu.js').default} NavMenu
 */

import { expect, waitFor, within } from 'storybook/test';

/**
 * Sets up the play function for the nav menu story.
 * @param {HTMLElement} canvasElement
 * @returns {Promise<{canvas: ReturnType<typeof within>, navMenu: NavMenu, resource: NavMenu['listResource']}>}
 */
export async function playSetup(canvasElement) {
    const canvas = within(canvasElement);
    await waitFor(() => expect(canvasElement.querySelector('nav-menu')).toBeInTheDocument());
    await customElements.whenDefined('nav-menu');
    const navMenu = /** @type {NavMenu} */ (canvasElement.querySelector('nav-menu'));
    await navMenu?.promise;
    return { canvas, navMenu, resource: navMenu?.listResource };
}
