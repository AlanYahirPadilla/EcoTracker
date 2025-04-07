import { defineConfig } from 'vite';  // ¡Asegúrate de que esté importado!

import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react';

export default defineConfig({
    plugins: [
        laravel({
            input: ['resources/css/app.css', 'resources/js/app.js'],
            refresh: true,
        }),
        react(),
    ],
    resolve: {
        alias: {
            '@': '/resources/js',
        },
    },
    optimizeDeps: {
        esbuildOptions: {
            loader: {
                '.js': 'jsx',
            },
        },
    },
    esbuild: {
        loader: 'jsx',
        include: ['**/*.js', '**/*.jsx'],
    },
    server: {
        host: 'localhost',
        port: 5173,
        strictPort: true,
        cors: true,
    },
});
