// A more explicit PostCSS configuration
import tailwindcss from 'tailwindcss';
import autoprefixer from 'autoprefixer';

export default {
  plugins: [
    tailwindcss('./tailwind.config.js'), // Explicitly point to your config
    autoprefixer,
  ],
};