
import { Server as SocketIOServer } from "socket.io";
import { Server as HttpServer } from "http";

export function setupSocketIO(httpServer: HttpServer) {
    const io = new SocketIOServer(httpServer, {
        cors: {
            origin: "*",
            methods: ["GET", "POST"]
        }
    });

    const userSockets: any = {};

    io.on('connection', (socket) => {
        console.log('Client connected:', socket.id);

        socket.on('join-location', ({ userId, lat, lng }) => {
            // Guardar socket por ubicación (simplificado)
            userSockets[userId] = { socketId: socket.id, lat, lng };
            socket.join('global-pet-network');
        });

        // Escuchar nuevas alertas Amber
        socket.on('new-lost-pet', (alertData) => {
            // En una implementación real, calcularíamos distancia con haversine
            // Por ahora, emitimos a todos en la red "global"
            socket.broadcast.emit('amber-alert', alertData);
            console.log('AMBER ALERT EMITTED:', alertData.name);
        });

        socket.on('disconnect', () => {
            console.log('Client disconnected:', socket.id);
        });
    });

    return io;
}
