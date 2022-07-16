import {defineConfig} from 'windicss/helpers';
import formsPlugin from 'windicss/plugin/forms';

export default defineConfig({
  attributify: true,
  darkMode: 'class',
  safelist: 'p-3 p-4 p-5',
  theme: {
    extend: {
      colors: {
        teal: {
          100: '#096',
        },
      },
      fontFamily: {
        sans: ['Noto Sans SC', 'ui-sans-serif', 'system-ui'],
        serif: ['Noto Serif SC', 'ui-serif', 'Georgia'],
        mono: ['ui-monospace', 'SFMono-Regular'],
        display: ['Noto Sans SC', 'Oswald'],
        body: ['Noto Sans SC', 'Open Sans'],
      },
    },
  },
  plugins: [formsPlugin],
});
