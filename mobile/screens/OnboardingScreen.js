import React, { useState } from 'react';
import { View, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import OnboardingQuestions from '../components/OnboardingQuestions';
import * as api from '../api';

export default function OnboardingScreen({ navigation, userId }) {
  const [submitting, setSubmitting] = useState(false);

  const handleComplete = async (answers) => {
    try {
      setSubmitting(true);

      // Transformar respuestas al formato del backend
      const petData = {
        name: answers.pet_name,
        type: answers.pet_type,
        breed: answers.breed || 'Mestizo',
        dateOfBirth: answers.birth_date,
        gender: answers.gender === 'Macho' ? 'male' : 'female',
        activityLevel: answers.activity_level,
        healthConcerns: answers.health_concerns,
        primaryGoal: answers.primary_goal,
        owner: userId,
      };

      // Crear perfil de mascota
      const response = await api.createPetProfile(petData);

      if (response.data.success) {
        // Navegar a la pantalla principal
        navigation.replace('Home', {
          petId: response.data.pet.id,
          petData: response.data.pet,
        });
      }
    } catch (error) {
      console.error('Error completando onboarding:', error);
      Alert.alert(
        'Error',
        'No se pudo crear el perfil. Por favor, intenta de nuevo.',
        [{ text: 'OK' }]
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (submitting) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#34C759" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <OnboardingQuestions onComplete={handleComplete} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
});



