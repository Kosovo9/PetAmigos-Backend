import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { Share2, Download, Sparkles, Lock } from 'lucide-react-native';

export default function MemoryCard({ memory, onShare, onUnlockHD }) {
  const isPremium = memory.isPremiumUnlocked || false;

  return (
    <View style={styles.card}>
      {/* Thumbnail del Video/Montaje */}
      <Image
        source={{ uri: memory.thumbnail || 'https://via.placeholder.com/400' }}
        style={styles.thumbnail}
        resizeMode="cover"
      />

      {/* Overlay con información */}
      <View style={styles.overlay}>
        <View style={styles.content}>
          {/* Título y Fecha */}
          <View style={styles.header}>
            <View style={styles.titleContainer}>
              <Sparkles size={20} color="#FFD700" />
              <Text style={styles.title}>{memory.title}</Text>
            </View>
            <Text style={styles.date}>{formatDate(memory.date)}</Text>
          </View>

          {/* Descripción */}
          {memory.description && (
            <Text style={styles.description} numberOfLines={2}>
              {memory.description}
            </Text>
          )}

          {/* Botones de Acción */}
          <View style={styles.actions}>
            {/* Botón Compartir (Gratis) */}
            <TouchableOpacity
              style={[styles.actionButton, styles.shareButton]}
              onPress={onShare}
            >
              <Share2 size={18} color="#fff" />
              <Text style={styles.actionButtonText}>Compartir</Text>
            </TouchableOpacity>

            {/* Botón HD/4K (Paywall) */}
            <TouchableOpacity
              style={[styles.actionButton, isPremium ? styles.downloadButton : styles.lockedButton]}
              onPress={onUnlockHD}
            >
              {!isPremium && <Lock size={18} color="#fff" />}
              {isPremium && <Download size={18} color="#fff" />}
              <Text style={styles.actionButtonText}>
                {isPremium ? 'Descargar HD' : 'Desbloquear HD 💎'}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Badge Premium */}
          {!isPremium && (
            <View style={styles.premiumBadge}>
              <Text style={styles.premiumBadgeText}>
                Requiere Suscripción Gold
              </Text>
            </View>
          )}
        </View>
      </View>
    </View>
  );
}

function formatDate(dateString) {
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = Math.abs(now - date);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'Hoy';
  if (diffDays === 1) return 'Ayer';
  if (diffDays < 30) return `Hace ${diffDays} días`;
  if (diffDays < 365) return `Hace ${Math.floor(diffDays / 30)} meses`;
  return `Hace ${Math.floor(diffDays / 365)} años`;
}

const styles = StyleSheet.create({
  card: {
    marginBottom: 16,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  thumbnail: {
    width: '100%',
    height: 200,
    backgroundColor: '#f0f0f0',
  },
  overlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)',
    backgroundColor: 'rgba(0,0,0,0.6)',
    padding: 16,
  },
  content: {
    paddingTop: 40,
  },
  header: {
    marginBottom: 8,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginLeft: 8,
    flex: 1,
  },
  date: {
    fontSize: 12,
    color: '#fff',
    opacity: 0.8,
    marginTop: 4,
  },
  description: {
    fontSize: 14,
    color: '#fff',
    opacity: 0.9,
    marginBottom: 12,
    lineHeight: 20,
  },
  actions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 8,
    gap: 6,
  },
  shareButton: {
    backgroundColor: '#007AFF',
  },
  downloadButton: {
    backgroundColor: '#34C759',
  },
  lockedButton: {
    backgroundColor: '#FF9500',
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
  },
  premiumBadge: {
    marginTop: 8,
    padding: 6,
    backgroundColor: 'rgba(255, 215, 0, 0.2)',
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  premiumBadgeText: {
    fontSize: 11,
    color: '#FFD700',
    fontWeight: '600',
  },
});


