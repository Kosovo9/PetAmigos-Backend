import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, Image } from 'react-native';
import { Heart, X, Lock, MessageCircle } from 'lucide-react-native';

export default function MatchModal({ match, onPay, onContinue }) {
  return (
    <Modal
      visible={true}
      transparent={true}
      animationType="fade"
      onRequestClose={onContinue}
    >
      <View style={styles.overlay}>
        <View style={styles.modal}>
          {/* Header con animación de Match */}
          <View style={styles.header}>
            <Text style={styles.matchTitle}>¡Es un MATCH! 💖</Text>
            <View style={styles.heartsContainer}>
              <Heart size={24} color="#FF3B5C" fill="#FF3B5C" />
              <Heart size={32} color="#FF3B5C" fill="#FF3B5C" />
              <Heart size={24} color="#FF3B5C" fill="#FF3B5C" />
            </View>
          </View>

          {/* Imagen de la mascota match */}
          <Image
            source={{ uri: match.pet.photo }}
            style={styles.matchImage}
            resizeMode="cover"
          />

          {/* Información del Match */}
          <View style={styles.content}>
            <Text style={styles.petName}>{match.pet.name}</Text>
            <Text style={styles.matchText}>
              El dueño de <Text style={styles.bold}>{match.pet.name}</Text> también está interesado.
            </Text>
            <Text style={styles.description}>
              Desbloquea el chat y la información de contacto para conectar.
            </Text>

            {/* Paywall */}
            <View style={styles.paywall}>
              <View style={styles.lockIcon}>
                <Lock size={20} color="#FF9500" />
              </View>
              <View style={styles.priceContainer}>
                <Text style={styles.price}>$19.99 USD</Text>
                <Text style={styles.priceSubtext}>Pago único</Text>
              </View>
            </View>

            {/* Beneficios del desbloqueo */}
            <View style={styles.benefits}>
              <View style={styles.benefit}>
                <MessageCircle size={16} color="#34C759" />
                <Text style={styles.benefitText}>Chat ilimitado</Text>
              </View>
              <View style={styles.benefit}>
                <Heart size={16} color="#34C759" />
                <Text style={styles.benefitText}>Información de contacto</Text>
              </View>
              <View style={styles.benefit}>
                <Lock size={16} color="#34C759" />
                <Text style={styles.benefitText}>Acceso exclusivo</Text>
              </View>
            </View>
          </View>

          {/* Botones de Acción */}
          <View style={styles.actions}>
            <TouchableOpacity
              style={[styles.button, styles.payButton]}
              onPress={onPay}
            >
              <Text style={styles.payButtonText}>Pagar y Abrir Chat</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.continueButton]}
              onPress={onContinue}
            >
              <Text style={styles.continueButtonText}>Seguir Deslizando</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modal: {
    backgroundColor: '#fff',
    borderRadius: 20,
    width: '100%',
    maxWidth: 400,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  header: {
    padding: 20,
    alignItems: 'center',
    backgroundColor: '#FFE5E9',
  },
  matchTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FF3B5C',
    marginBottom: 12,
  },
  heartsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  matchImage: {
    width: '100%',
    height: 200,
    backgroundColor: '#f0f0f0',
  },
  content: {
    padding: 20,
  },
  petName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
    textAlign: 'center',
  },
  matchText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 12,
    lineHeight: 22,
  },
  bold: {
    fontWeight: 'bold',
    color: '#333',
  },
  description: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    marginBottom: 20,
  },
  paywall: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFF4E6',
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
  },
  lockIcon: {
    marginRight: 12,
  },
  priceContainer: {
    alignItems: 'center',
  },
  price: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FF9500',
  },
  priceSubtext: {
    fontSize: 12,
    color: '#999',
    marginTop: 2,
  },
  benefits: {
    marginBottom: 20,
  },
  benefit: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  benefitText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 8,
  },
  actions: {
    padding: 20,
    paddingTop: 0,
    gap: 12,
  },
  button: {
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  payButton: {
    backgroundColor: '#34C759',
  },
  payButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  continueButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  continueButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
  },
});


