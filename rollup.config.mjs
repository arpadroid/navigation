import { getBuild } from '@arpadroid/arpadroid/src/rollup/builds/rollup-builds.mjs';
const { build, buildConfig, appBuild } = getBuild('navigation', 'uiComponent');
const external = appBuild.external ?? [];
if (buildConfig.slim) {
    appBuild.external = [...external, '@arpadroid/lists'];
}
export default build;
