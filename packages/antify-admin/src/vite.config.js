// vite.config.js
export default {
  server: {
    hmr: {
      protocol: 'ws',
      clientPort: 443,
    },
  },
};
