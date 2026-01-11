import { getBuild, isSlim } from '@arpadroid/module';
const { build = {} } = getBuild('navigation', {
    external: isSlim() ? ['lists', 'forms'] : []
}) || {};
export default build;
