import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { Heart, X, MapPin, Calendar, Users } from 'lucide-react-native';

const { width, height } = Dimensions.get('window');
const CARD_WIDTH = width * 0.9;
const CARD_HEIGHT = height * 0.7;

export default function PetCard({ pet, onSwipeLeft, onSwipeRight, onPress }) {
  return (
    <TouchableOpacity 
      style={styles.card}
      activeOpacity={0.9}
      onPress={onPress}
    >
      {/* Imagen Principal */}
      <Image 
        source={{ uri: pet.photo || 'https://via.placeholder.com/400' }}
        style={styles.image}
        resizeMode="cover"
      />
      
      {/* Overlay Gradient */}
      <View style={styles.overlay} />
      
      {/* Información del Perfil */}
      <View style={styles.infoContainer}>
        <View style={styles.header}>
          <View>
            <Text style={styles.name}>{pet.name}</Text>
            <Text style={styles.breed}>{pet.breed}</Text>
          </View>
          <Text style={styles.age}>{pet.age} años</Text>
        </View>
        
        {/* Detalles */}
        <View style={styles.details}>
          {pet.location && (
            <View style={styles.detailRow}>
              <MapPin size={16} color="#fff" />
              <Text style={styles.detailText}>{pet.location}</Text>
            </View>
          )}
          
          {pet.availableForBreeding && (
            <View style={styles.detailRow}>
              <Users size={16} color="#fff" />
              <Text style={styles.detailText}>Disponible para cruce</Text>
            </View>
          )}
          
          {pet.birthDate && (
            <View style={styles.detailRow}>
              <Calendar size={16} color="#fff" />
              <Text style={styles.detailText}>
                Nacido: {new Date(pet.birthDate).toLocaleDateString()}
              </Text>
            </View>
          )}
        </View>
        
        {/* Bio */}
        {pet.bio && (
          <Text style={styles.bio} numberOfLines={3}>
            {pet.bio}
          </Text>
        )}
      </View>
      
      {/* Botones de Acción */}
      <View style={styles.actionButtons}>
        <TouchableOpacity 
          style={[styles.actionButton, styles.rejectButton]}
          onPress={onSwipeLeft}
        >
          <X size={24} color="#fff" />
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.actionButton, styles.likeButton]}
          onPress={onSwipeRight}
        >
          <Heart size={24} color="#fff" fill="#fff" />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    borderRadius: 20,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 10,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '60%',
  },
  overlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '50%',
    background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)',
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  infoContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    paddingBottom: 80,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  name: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  breed: {
    fontSize: 18,
    color: '#fff',
    opacity: 0.9,
  },
  age: {
    fontSize: 20,
    fontWeight: '600',
    color: '#fff',
  },
  details: {
    marginTop: 10,
    marginBottom: 10,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  detailText: {
    fontSize: 14,
    color: '#fff',
    marginLeft: 8,
    opacity: 0.9,
  },
  bio: {
    fontSize: 14,
    color: '#fff',
    opacity: 0.85,
    lineHeight: 20,
    marginTop: 8,
  },
  actionButtons: {
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 40,
  },
  actionButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  rejectButton: {
    backgroundColor: '#FF3B30',
  },
  likeButton: {
    backgroundColor: '#34C759',
  },
});



