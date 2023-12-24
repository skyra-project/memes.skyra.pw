import config from '@sapphire/prettier-config';
import * as prettierPluginTailwindCss from 'prettier-plugin-tailwindcss';

/** @type {import('prettier').Options} */
export default {
	...config,
	plugins: [prettierPluginTailwindCss]
};
