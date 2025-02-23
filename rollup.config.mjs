import { getBuild, isSlim } from '@arpadroid/module/src/rollup/builds/rollup-builds.mjs';
const { build } = getBuild('navigation', 'uiComponent', {
    external: isSlim() ? ['lists', 'forms'] : []
});
export default build;
