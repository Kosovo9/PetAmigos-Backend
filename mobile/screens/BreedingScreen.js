import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import Swiper from 'react-native-deck-swiper';
import PetCard from '../components/PetCard';
import MatchModal from '../components/MatchModal';
import * as api from '../api';

export default function BreedingScreen({ userPet, navigation }) {
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [match, setMatch] = useState(null);
  const [showMatchModal, setShowMatchModal] = useState(false);

  useEffect(() => {
    loadBreedingPets();
  }, []);

  const loadBreedingPets = async () => {
    try {
      setLoading(true);
      // Filtrar: misma raza, sexo opuesto, disponible para cruce
      const response = await api.getBreedingMatches({
        breed: userPet.breed,
        gender: userPet.gender === 'male' ? 'female' : 'male',
        availableForBreeding: true,
        excludePetId: userPet.id
      });
      setPets(response.data.pets || []);
    } catch (error) {
      console.error('Error cargando mascotas:', error);
      Alert.alert('Error', 'No se pudieron cargar las mascotas disponibles');
    } finally {
      setLoading(false);
    }
  };

  const handleSwipeLeft = async (index) => {
    const pet = pets[index];
    try {
      await api.recordSwipe({
        swiperPetId: userPet.id,
        swipedPetId: pet.id,
        action: 'reject'
      });
    } catch (error) {
      console.error('Error registrando swipe:', error);
    }
  };

  const handleSwipeRight = async (index) => {
    const pet = pets[index];
    try {
      const response = await api.recordSwipe({
        swiperPetId: userPet.id,
        swipedPetId: pet.id,
        action: 'like'
      });

      // Verificar si hay match mutuo
      if (response.data.isMatch) {
        setMatch({
          pet: pet,
          matchedAt: new Date()
        });
        setShowMatchModal(true);
      }
    } catch (error) {
      console.error('Error registrando like:', error);
    }
  };

  const handleMatchPayment = async () => {
    try {
      // Procesar pago de $19.99 USD
      const paymentResponse = await api.processMatchPayment({
        matchId: match.id,
        amount: 19.99,
        currency: 'USD'
      });

      if (paymentResponse.data.success) {
        setShowMatchModal(false);
        // Navegar al chat
        navigation.navigate('Chat', {
          matchId: match.id,
          otherPet: match.pet
        });
      }
    } catch (error) {
      console.error('Error procesando pago:', error);
      Alert.alert('Error', 'No se pudo procesar el pago. Intenta de nuevo.');
    }
  };

  const handleContinueSwiping = () => {
    setShowMatchModal(false);
    setMatch(null);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#34C759" />
        <Text style={styles.loadingText}>Buscando matches perfectos...</Text>
      </View>
    );
  }

  if (pets.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No hay mascotas disponibles</Text>
        <Text style={styles.emptySubtext}>
          Intenta ajustar tus filtros o vuelve más tarde
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Breeding Matchmaker</Text>
        <Text style={styles.subtitle}>
          Desliza para encontrar el match perfecto
        </Text>
      </View>

      <Swiper
        cards={pets}
        renderCard={(pet) => (
          <PetCard
            pet={pet}
            onSwipeLeft={() => handleSwipeLeft(pets.indexOf(pet))}
            onSwipeRight={() => handleSwipeRight(pets.indexOf(pet))}
            onPress={() => navigation.navigate('PetDetail', { pet })}
          />
        )}
        onSwipedLeft={handleSwipeLeft}
        onSwipedRight={handleSwipeRight}
        cardIndex={currentIndex}
        backgroundColor="transparent"
        stackSize={3}
        stackSeparation={15}
        animateOverlayLabelsOpacity
        animateCardOpacity
        swipeAnimationDuration={300}
        onSwipedAll={() => {
          Alert.alert(
            '¡Has visto todas las mascotas!',
            'Vuelve más tarde para ver nuevos matches',
            [{ text: 'OK', onPress: () => navigation.goBack() }]
          );
        }}
      />

      {showMatchModal && match && (
        <MatchModal
          match={match}
          onPay={handleMatchPayment}
          onContinue={handleContinueSwiping}
        />
      )}
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
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
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
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  emptyText: {
    fontSize: 20,
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


