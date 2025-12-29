module.exports = {
    apps: [{
        name: 'petamigos',
        script: './server/_core/index.js', // Ajustar ruta al archivo compilado
        instances: 1,
        autorestart: true,
        watch: false,
        max_memory_restart: '500M',
        env: {
            NODE_ENV: 'production',
            PORT: 5000
        }
    }]
};
