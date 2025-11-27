import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, RefreshControl } from 'react-native';
import MemoryCard from '../components/MemoryCard';
import * as api from '../api';

export default function MemoryLaneScreen({ petId, navigation }) {
  const [memories, setMemories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadMemories();
  }, [petId]);

  const loadMemories = async () => {
    try {
      setLoading(true);
      const response = await api.getMemoryLane({ petId });
      setMemories(response.data.memories || []);
    } catch (error) {
      console.error('Error cargando recuerdos:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    loadMemories();
  };

  const handleShare = async (memory) => {
    try {
      await api.shareMemory({ memoryId: memory.id });
      // Abrir menú de compartir nativo
      // Share.share({ message: memory.shareUrl });
    } catch (error) {
      console.error('Error compartiendo:', error);
    }
  };

  const handleUnlockHD = async (memory) => {
    // Navegar a pantalla de pago o verificar suscripción
    navigation.navigate('Upgrade', {
      feature: 'memory_hd',
      memoryId: memory.id
    });
  };

  if (loading && memories.length === 0) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#34C759" />
        <Text style={styles.loadingText}>Generando tus recuerdos...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Memory Lane</Text>
        <Text style={styles.subtitle}>
          Cápsulas del tiempo generadas por IA
        </Text>
      </View>

      <FlatList
        data={memories}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <MemoryCard
            memory={item}
            onShare={() => handleShare(item)}
            onUnlockHD={() => handleUnlockHD(item)}
          />
        )}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={['#34C759']}
          />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              Aún no hay recuerdos generados
            </Text>
            <Text style={styles.emptySubtext}>
              Los recuerdos se generan automáticamente en hitos importantes
            </Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 20,
    paddingTop: 60,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
  },
  listContent: {
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
  emptyContainer: {
    padding: 40,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
});


