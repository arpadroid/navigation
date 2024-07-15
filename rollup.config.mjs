import { getBuild, isSlim } from '@arpadroid/arpadroid/src/rollup/builds/rollup-builds.mjs';
const { build, buildConfig, appBuild } = getBuild('navigation', 'uiComponent', {
    external: isSlim() && ['lists']
});
export default build;
