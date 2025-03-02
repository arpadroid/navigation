import { getBuild, isSlim } from '@arpadroid/module';
const { build = {} } = getBuild('navigation', 'uiComponent', {
    external: isSlim() ? ['lists', 'forms'] : []
}) || {};
export default build;
