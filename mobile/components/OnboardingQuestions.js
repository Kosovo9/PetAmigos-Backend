import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput } from 'react-native';
import { ArrowRight, ArrowLeft, Check } from 'lucide-react-native';

const QUESTIONS = [
  {
    id: 'pet_name',
    question: '¿Cuál es el nombre de tu mascota?',
    type: 'text',
    placeholder: 'Ej: Max, Luna, Charlie...',
    required: true,
  },
  {
    id: 'pet_type',
    question: '¿Qué tipo de mascota es?',
    type: 'select',
    options: ['Perro', 'Gato', 'Otro'],
    required: true,
  },
  {
    id: 'breed',
    question: '¿Cuál es la raza de tu mascota?',
    type: 'text',
    placeholder: 'Ej: Golden Retriever, Persa, Mestizo...',
    required: false,
  },
  {
    id: 'birth_date',
    question: '¿Cuándo nació tu mascota?',
    type: 'date',
    required: true,
  },
  {
    id: 'gender',
    question: '¿Cuál es el género de tu mascota?',
    type: 'select',
    options: ['Macho', 'Hembra'],
    required: true,
  },
  {
    id: 'activity_level',
    question: '¿Cómo describirías el nivel de actividad de tu mascota?',
    type: 'select',
    options: ['Muy Activo', 'Activo', 'Moderado', 'Tranquilo'],
    required: true,
  },
  {
    id: 'health_concerns',
    question: '¿Tiene alguna preocupación de salud actual?',
    type: 'select',
    options: ['Ninguna', 'Alergias', 'Problemas Articulares', 'Obesidad', 'Otro'],
    required: false,
  },
  {
    id: 'primary_goal',
    question: '¿Cuál es tu principal objetivo con PetAmigos?',
    type: 'select',
    options: [
      'Monitorear la salud',
      'Encontrar pareja para cruce',
      'Conectar con otros dueños',
      'Acceder a servicios premium',
    ],
    required: true,
  },
];

export default function OnboardingQuestions({ onComplete, initialData = {} }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState(initialData);
  const [errors, setErrors] = useState({});

  const currentQuestion = QUESTIONS[currentStep];
  const isLastStep = currentStep === QUESTIONS.length - 1;
  const isFirstStep = currentStep === 0;

  const handleNext = () => {
    // Validar respuesta actual
    if (currentQuestion.required && !answers[currentQuestion.id]) {
      setErrors({ [currentQuestion.id]: 'Este campo es requerido' });
      return;
    }

    setErrors({});

    if (isLastStep) {
      onComplete(answers);
    } else {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (!isFirstStep) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleAnswer = (value) => {
    setAnswers({ ...answers, [currentQuestion.id]: value });
    setErrors({ ...errors, [currentQuestion.id]: null });
  };

  const renderQuestionInput = () => {
    switch (currentQuestion.type) {
      case 'text':
        return (
          <TextInput
            style={[styles.textInput, errors[currentQuestion.id] && styles.inputError]}
            placeholder={currentQuestion.placeholder}
            value={answers[currentQuestion.id] || ''}
            onChangeText={handleAnswer}
            autoFocus
          />
        );

      case 'select':
        return (
          <View style={styles.optionsContainer}>
            {currentQuestion.options.map((option) => (
              <TouchableOpacity
                key={option}
                style={[
                  styles.option,
                  answers[currentQuestion.id] === option && styles.optionSelected,
                ]}
                onPress={() => handleAnswer(option)}
              >
                <Text
                  style={[
                    styles.optionText,
                    answers[currentQuestion.id] === option && styles.optionTextSelected,
                  ]}
                >
                  {option}
                </Text>
                {answers[currentQuestion.id] === option && (
                  <Check size={20} color="#34C759" />
                )}
              </TouchableOpacity>
            ))}
          </View>
        );

      case 'date':
        // En producción, usar DatePicker
        return (
          <TextInput
            style={[styles.textInput, errors[currentQuestion.id] && styles.inputError]}
            placeholder="YYYY-MM-DD"
            value={answers[currentQuestion.id] || ''}
            onChangeText={handleAnswer}
            autoFocus
          />
        );

      default:
        return null;
    }
  };

  const progress = ((currentStep + 1) / QUESTIONS.length) * 100;

  return (
    <View style={styles.container}>
      {/* Progress Bar */}
      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${progress}%` }]} />
        </View>
        <Text style={styles.progressText}>
          {currentStep + 1} de {QUESTIONS.length}
        </Text>
      </View>

      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
        {/* Question */}
        <Text style={styles.question}>{currentQuestion.question}</Text>
        {currentQuestion.required && (
          <Text style={styles.requiredLabel}>* Requerido</Text>
        )}

        {/* Input */}
        <View style={styles.inputContainer}>{renderQuestionInput()}</View>

        {/* Error Message */}
        {errors[currentQuestion.id] && (
          <Text style={styles.errorText}>{errors[currentQuestion.id]}</Text>
        )}
      </ScrollView>

      {/* Navigation */}
      <View style={styles.navigation}>
        {!isFirstStep && (
          <TouchableOpacity
            style={[styles.navButton, styles.backButton]}
            onPress={handlePrevious}
          >
            <ArrowLeft size={20} color="#666" />
            <Text style={styles.backButtonText}>Atrás</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity
          style={[styles.navButton, styles.nextButton, isFirstStep && styles.nextButtonFull]}
          onPress={handleNext}
        >
          <Text style={styles.nextButtonText}>
            {isLastStep ? 'Completar' : 'Siguiente'}
          </Text>
          {!isLastStep && <ArrowRight size={20} color="#fff" />}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  progressContainer: {
    padding: 20,
    paddingTop: 60,
    backgroundColor: '#f5f5f5',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  progressBar: {
    height: 4,
    backgroundColor: '#e0e0e0',
    borderRadius: 2,
    marginBottom: 8,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#34C759',
    borderRadius: 2,
  },
  progressText: {
    fontSize: 12,
    color: '#666',
    textAlign: 'right',
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 24,
  },
  question: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
    lineHeight: 32,
  },
  requiredLabel: {
    fontSize: 12,
    color: '#FF3B30',
    marginBottom: 24,
  },
  inputContainer: {
    marginTop: 8,
  },
  textInput: {
    borderWidth: 2,
    borderColor: '#e0e0e0',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
  },
  inputError: {
    borderColor: '#FF3B30',
  },
  optionsContainer: {
    gap: 12,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 2,
    borderColor: '#e0e0e0',
    borderRadius: 12,
    padding: 16,
    backgroundColor: '#f9f9f9',
  },
  optionSelected: {
    borderColor: '#34C759',
    backgroundColor: '#E8F5E9',
  },
  optionText: {
    fontSize: 16,
    color: '#333',
    flex: 1,
  },
  optionTextSelected: {
    fontWeight: '600',
    color: '#34C759',
  },
  errorText: {
    fontSize: 12,
    color: '#FF3B30',
    marginTop: 8,
  },
  navigation: {
    flexDirection: 'row',
    padding: 20,
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  navButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    gap: 8,
  },
  backButton: {
    backgroundColor: '#f5f5f5',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
  },
  nextButton: {
    backgroundColor: '#34C759',
  },
  nextButtonFull: {
    flex: 1,
  },
  nextButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
});


