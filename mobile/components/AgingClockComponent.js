import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, ScrollView, ActivityIndicator } from 'react-native';
import { Clock, Lock, Shield, TrendingUp, Heart, Sparkles } from 'lucide-react-native';
import * as api from '../api';

export default function AgingClockComponent({ petId, petData, onUpgrade }) {
  const [loading, setLoading] = useState(true);
  const [showPaywall, setShowPaywall] = useState(false);
  const [biologicalAge, setBiologicalAge] = useState(null);
  const [chronologicalAge, setChronologicalAge] = useState(null);
  const [isPremium, setIsPremium] = useState(false);
  const [healthScore, setHealthScore] = useState(null);

  useEffect(() => {
    loadAgingData();
  }, [petId]);

  const loadAgingData = async () => {
    try {
      setLoading(true);
      const response = await api.getPetAgingData({ petId });
      const data = response.data;
      
      setBiologicalAge(data.biologicalAge);
      setChronologicalAge(data.chronologicalAge);
      setIsPremium(data.isLifetimeMember || false);
      setHealthScore(data.healthScore);
    } catch (error) {
      console.error('Error cargando datos de aging:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateAgeDifference = () => {
    if (!biologicalAge || !chronologicalAge) return 0;
    return biologicalAge - chronologicalAge;
  };

  const getRiskLevel = () => {
    const diff = calculateAgeDifference();
    if (diff > 2) return { level: 'HIGH', color: '#FF3B30', message: 'Riesgo Alto' };
    if (diff > 1) return { level: 'MEDIUM', color: '#FF9500', message: 'Riesgo Moderado' };
    return { level: 'LOW', color: '#34C759', message: 'Salud Óptima' };
  };

  const handleViewFullReport = () => {
    if (isPremium) {
      // Navegar a reporte completo
      onUpgrade?.('view_report');
    } else {
      setShowPaywall(true);
    }
  };

  const handleUpgrade = () => {
    setShowPaywall(false);
    onUpgrade?.('purchase_lifetime');
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#34C759" />
        <Text style={styles.loadingText}>Calculando edad biológica...</Text>
      </View>
    );
  }

  const risk = getRiskLevel();
  const ageDiff = calculateAgeDifference();

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Clock size={24} color="#007AFF" />
          <Text style={styles.title}>Pet Aging Clock</Text>
        </View>
        {!isPremium && (
          <View style={styles.premiumBadge}>
            <Lock size={14} color="#FF9500" />
            <Text style={styles.premiumBadgeText}>Premium</Text>
          </View>
        )}
      </View>

      {/* Main Card */}
      <View style={styles.card}>
        {/* Edad Cronológica (Visible para todos) */}
        <View style={styles.ageSection}>
          <Text style={styles.ageLabel}>Edad Cronológica</Text>
          <Text style={styles.chronologicalAge}>
            {chronologicalAge?.toFixed(1) || '0'} años
          </Text>
        </View>

        {/* Edad Biológica (BLINDADO - Solo Premium) */}
        <View style={styles.ageSection}>
          <View style={styles.biologicalAgeHeader}>
            <Text style={styles.ageLabel}>Edad Biológica Real</Text>
            {!isPremium && <Lock size={16} color="#FF9500" />}
          </View>
          
          {isPremium ? (
            <View style={styles.biologicalAgeContainer}>
              <Text style={[styles.biologicalAge, { color: risk.color }]}>
                {biologicalAge?.toFixed(2) || '0.00'} años
              </Text>
              <View style={[styles.riskBadge, { backgroundColor: risk.color + '20' }]}>
                <Text style={[styles.riskText, { color: risk.color }]}>
                  {risk.message}
                </Text>
              </View>
            </View>
          ) : (
            <View style={styles.lockedContainer}>
              <View style={styles.lockedOverlay}>
                <Lock size={32} color="#FF9500" />
                <Text style={styles.lockedText}>Desbloquea con Pasaporte de Longevidad</Text>
                <Text style={styles.lockedSubtext}>
                  Descubre la edad real de tu mascota y protege su futuro
                </Text>
              </View>
            </View>
          )}
        </View>

        {/* Diferencia de Edad (Solo si es Premium) */}
        {isPremium && ageDiff !== 0 && (
          <View style={styles.differenceSection}>
            <TrendingUp size={20} color={ageDiff > 0 ? '#FF3B30' : '#34C759'} />
            <Text style={[styles.differenceText, { color: ageDiff > 0 ? '#FF3B30' : '#34C759' }]}>
              {ageDiff > 0 ? '+' : ''}{ageDiff.toFixed(2)} años
              {ageDiff > 0 ? ' de envejecimiento acelerado' : ' de longevidad'}
            </Text>
          </View>
        )}

        {/* Health Score (Solo Premium) */}
        {isPremium && healthScore !== null && (
          <View style={styles.healthScoreSection}>
            <Heart size={20} color="#FF3B5C" />
            <Text style={styles.healthScoreLabel}>Health Score</Text>
            <View style={styles.healthScoreBar}>
              <View 
                style={[
                  styles.healthScoreFill, 
                  { width: `${healthScore}%`, backgroundColor: getHealthColor(healthScore) }
                ]} 
              />
            </View>
            <Text style={styles.healthScoreValue}>{healthScore}/100</Text>
          </View>
        )}

        {/* Call to Action */}
        <TouchableOpacity
          style={[styles.ctaButton, isPremium && styles.ctaButtonPremium]}
          onPress={handleViewFullReport}
        >
          <Text style={styles.ctaButtonText}>
            {isPremium ? 'Ver Reporte Completo' : 'Desbloquear Pasaporte de Longevidad'}
          </Text>
          {!isPremium && <Sparkles size={18} color="#fff" style={{ marginLeft: 8 }} />}
        </TouchableOpacity>
      </View>

      {/* Paywall Modal */}
      <PaywallModal
        visible={showPaywall}
        onClose={() => setShowPaywall(false)}
        onUpgrade={handleUpgrade}
        petName={petData?.name || 'tu mascota'}
      />
    </View>
  );
}

function PaywallModal({ visible, onClose, onUpgrade, petName }) {
  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Shield size={32} color="#FF9500" />
            <Text style={styles.modalTitle}>Pasaporte de Longevidad</Text>
            <Text style={styles.modalSubtitle}>
              Protege el futuro de {petName}
            </Text>
          </View>

          <ScrollView style={styles.modalBody}>
            <View style={styles.benefit}>
              <Clock size={20} color="#34C759" />
              <View style={styles.benefitText}>
                <Text style={styles.benefitTitle}>Edad Biológica en Tiempo Real</Text>
                <Text style={styles.benefitDescription}>
                  Conoce la edad real de tu mascota calculada por IA avanzada
                </Text>
              </View>
            </View>

            <View style={styles.benefit}>
              <Heart size={20} color="#34C759" />
              <View style={styles.benefitText}>
                <Text style={styles.benefitTitle}>Health Score Predictivo</Text>
                <Text style={styles.benefitDescription}>
                  Monitorea la salud de tu mascota con métricas avanzadas
                </Text>
              </View>
            </View>

            <View style={styles.benefit}>
              <TrendingUp size={20} color="#34C759" />
              <View style={styles.benefitText}>
                <Text style={styles.benefitTitle}>Alertas Preventivas</Text>
                <Text style={styles.benefitDescription}>
                  Recibe notificaciones cuando tu mascota necesita atención
                </Text>
              </View>
            </View>

            <View style={styles.benefit}>
              <Sparkles size={20} color="#34C759" />
              <View style={styles.benefitText}>
                <Text style={styles.benefitTitle}>Reportes Detallados</Text>
                <Text style={styles.benefitDescription}>
                  Acceso a análisis completos de longevidad y salud
                </Text>
              </View>
            </View>

            <View style={styles.pricingContainer}>
              <Text style={styles.price}>$99 USD</Text>
              <Text style={styles.pricePeriod}>/año</Text>
            </View>
          </ScrollView>

          <View style={styles.modalActions}>
            <TouchableOpacity
              style={styles.upgradeButton}
              onPress={onUpgrade}
            >
              <Text style={styles.upgradeButtonText}>
                Comprar Pasaporte de Longevidad
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.cancelButton}
              onPress={onClose}
            >
              <Text style={styles.cancelButtonText}>Tal vez después</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

function getHealthColor(score) {
  if (score >= 80) return '#34C759';
  if (score >= 60) return '#FF9500';
  return '#FF3B30';
}

const styles = StyleSheet.create({
  container: {
    margin: 16,
  },
  loadingContainer: {
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: '#666',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  premiumBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF4E6',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    gap: 4,
  },
  premiumBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FF9500',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  ageSection: {
    marginBottom: 20,
  },
  ageLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
    fontWeight: '500',
  },
  chronologicalAge: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  biologicalAgeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  biologicalAgeContainer: {
    alignItems: 'flex-start',
  },
  biologicalAge: {
    fontSize: 36,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  riskBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  riskText: {
    fontSize: 12,
    fontWeight: '600',
  },
  lockedContainer: {
    height: 120,
    borderRadius: 12,
    backgroundColor: '#f5f5f5',
    borderWidth: 2,
    borderColor: '#FF9500',
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  lockedOverlay: {
    alignItems: 'center',
    padding: 20,
  },
  lockedText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FF9500',
    marginTop: 12,
    textAlign: 'center',
  },
  lockedSubtext: {
    fontSize: 12,
    color: '#999',
    marginTop: 6,
    textAlign: 'center',
  },
  differenceSection: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    gap: 8,
  },
  differenceText: {
    fontSize: 14,
    fontWeight: '600',
    flex: 1,
  },
  healthScoreSection: {
    marginBottom: 20,
  },
  healthScoreLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
    marginLeft: 28,
    fontWeight: '500',
  },
  healthScoreBar: {
    height: 8,
    backgroundColor: '#e0e0e0',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
  },
  healthScoreFill: {
    height: '100%',
    borderRadius: 4,
  },
  healthScoreValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'right',
  },
  ctaButton: {
    backgroundColor: '#FF9500',
    padding: 16,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  ctaButtonPremium: {
    backgroundColor: '#34C759',
  },
  ctaButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '90%',
  },
  modalHeader: {
    alignItems: 'center',
    padding: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 12,
    marginBottom: 4,
  },
  modalSubtitle: {
    fontSize: 14,
    color: '#666',
  },
  modalBody: {
    padding: 24,
  },
  benefit: {
    flexDirection: 'row',
    marginBottom: 20,
    gap: 12,
  },
  benefitText: {
    flex: 1,
  },
  benefitTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  benefitDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  pricingContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'center',
    marginTop: 20,
    marginBottom: 10,
  },
  price: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#FF9500',
  },
  pricePeriod: {
    fontSize: 18,
    color: '#999',
    marginLeft: 4,
  },
  modalActions: {
    padding: 24,
    gap: 12,
  },
  upgradeButton: {
    backgroundColor: '#FF9500',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  upgradeButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  cancelButton: {
    padding: 16,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    color: '#666',
  },
});



