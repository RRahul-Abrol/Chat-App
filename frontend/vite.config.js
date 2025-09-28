import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server:{
    port:3000,
    proxy:{
      "/api":{
        target:"http://localhost:8000",
         changeOrigin: true, // Crucial for virtual hosting and necessary for Express
        secure: false,      // Allows proxying to the local HTTP server
    },
  },
},
});
