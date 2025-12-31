/**
 * Monitor de rendimiento en tiempo real
 * Detecta jank, memory leaks, y bottlenecks
 */

import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
// Note: These would require installation of the corresponding libraries
// For now, mirroring the requested code structure
// import { useFpsMonitor } from 'react-native-fps-monitor';
// import { PerformanceMonitor as RNPerfMonitor } from 'react-native-performance-monitor';

interface PerformanceMetrics {
    fps: number;
    memoryUsed: number;
    memoryTotal: number;
    jankFrames: number;
    networkLatency: number;
    cpuUsage: number;
    renderTime: number;
}

export const PerformanceMonitor: React.FC = () => {
    const [metrics, setMetrics] = React.useState<PerformanceMetrics>({
        fps: 60,
        memoryUsed: 0,
        memoryTotal: 0,
        jankFrames: 0,
        networkLatency: 0,
        cpuUsage: 0,
        renderTime: 0,
    });

    // Mocking hooks for demonstration as they depend on external native modules
    const fps = { current: 60 };
    const memory = { used: 0, total: 0 };
    const jank = { count: 0 };
    const network = { latency: 0 };

    const lastLogRef = useRef(Date.now());

    useEffect(() => {
        const interval = setInterval(() => {
            const now = Date.now();
            if (now - lastLogRef.current > 5000) { // Log cada 5 segundos
                logPerformanceMetrics(metrics);
                lastLogRef.current = now;
            }

            setMetrics({
                fps: fps.current || 60,
                memoryUsed: memory.used,
                memoryTotal: memory.total,
                jankFrames: jank.count,
                networkLatency: network.latency,
                cpuUsage: getCPUUsage(),
                renderTime: getRenderTime(),
            });
        }, 1000);

        return () => clearInterval(interval);
    }, [metrics]);

    if (!__DEV__) return null;

    return (
        <View style={styles.container}>
            <View style={styles.metricsContainer}>
                <Text style={styles.metric}>FPS: {metrics.fps.toFixed(0)}</Text>
                <Text style={styles.metric}>
                    Mem: {(metrics.memoryUsed / 1024 / 1024).toFixed(1)}MB
                </Text>
                <Text style={styles.metric}>Jank: {metrics.jankFrames}</Text>
                <Text style={styles.metric}>CPU: {metrics.cpuUsage.toFixed(1)}%</Text>
            </View>
        </View>
    );
};

function getCPUUsage(): number {
    if (Platform.OS === 'android') {
        // Usar Android Performance Monitor
        return 0;
    } else if (Platform.OS === 'ios') {
        // Usar iOS Performance APIs
        return 0;
    }
    return 0;
}

function getRenderTime(): number {
    // Medir tiempo de render usando Performance API
    if (global.performance) {
        return global.performance.now();
    }
    return Date.now();
}

function logPerformanceMetrics(metrics: PerformanceMetrics) {
    console.log('[PERF]', JSON.stringify(metrics));

    // Enviar a servidor de monitoreo
    fetch('https://metrics.petmatch.global/mobile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            ...metrics,
            timestamp: Date.now(),
            platform: Platform.OS,
            version: Platform.Version,
        }),
    }).catch(() => { });
}

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        top: 50,
        right: 10,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        borderRadius: 8,
        padding: 8,
        zIndex: 9999,
    },
    metricsContainer: {
        flexDirection: 'column',
    },
    metric: {
        color: '#FFFFFF',
        fontSize: 10,
        fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
        marginVertical: 2,
    },
});
