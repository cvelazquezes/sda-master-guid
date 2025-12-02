import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';
import { UserRole } from '../../types';
import { designTokens } from '../../shared/theme/designTokens';
import { mobileTypography, mobileFontSizes } from '../../shared/theme/mobileTypography';

const PendingApprovalScreen = () => {
  const { user, logout } = useAuth();
  
  const isClubAdmin = user?.role === UserRole.CLUB_ADMIN;

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.content}>
        <View style={styles.iconContainer}>
          <MaterialCommunityIcons name="clock-alert-outline" size={100} color={designTokens.colors.warning} />
        </View>

        <Text style={styles.title}>Account Pending Approval</Text>

        <Text style={styles.message}>
          Thank you for registering, <Text style={styles.userName}>{user?.name}</Text>!
        </Text>

        <View style={styles.infoCard}>
          <View style={styles.infoRow}>
            <MaterialCommunityIcons name="email" size={20} color={designTokens.colors.textSecondary} />
            <Text style={styles.infoText}>{user?.email}</Text>
          </View>
          <View style={styles.infoRow}>
            <MaterialCommunityIcons name="whatsapp" size={20} color={designTokens.colors.textSecondary} />
            <Text style={styles.infoText}>{user?.whatsappNumber}</Text>
          </View>
        </View>

        <View style={styles.statusCard}>
          <View style={styles.statusHeader}>
            <MaterialCommunityIcons name="information" size={24} color={designTokens.colors.primary} />
            <Text style={styles.statusTitle}>What happens next?</Text>
          </View>

          {isClubAdmin ? (
            <>
              <View style={styles.statusStep}>
                <View style={styles.stepNumber}>
                  <Text style={styles.stepNumberText}>1</Text>
                </View>
                <Text style={styles.stepText}>
                  A system administrator will review your club admin registration
                </Text>
              </View>

              <View style={styles.statusStep}>
                <View style={styles.stepNumber}>
                  <Text style={styles.stepNumberText}>2</Text>
                </View>
                <Text style={styles.stepText}>
                  Once approved, you&apos;ll receive a notification via WhatsApp
                </Text>
              </View>

              <View style={styles.statusStep}>
                <View style={styles.stepNumber}>
                  <Text style={styles.stepNumberText}>3</Text>
                </View>
                <Text style={styles.stepText}>
                  You can then log in and manage your club
                </Text>
              </View>
            </>
          ) : (
            <>
              <View style={styles.statusStep}>
                <View style={styles.stepNumber}>
                  <Text style={styles.stepNumberText}>1</Text>
                </View>
                <Text style={styles.stepText}>
                  Your club administrator will review your registration
                </Text>
              </View>

              <View style={styles.statusStep}>
                <View style={styles.stepNumber}>
                  <Text style={styles.stepNumberText}>2</Text>
                </View>
                <Text style={styles.stepText}>
                  Once approved, you&apos;ll receive a notification via WhatsApp
                </Text>
              </View>

              <View style={styles.statusStep}>
                <View style={styles.stepNumber}>
                  <Text style={styles.stepNumberText}>3</Text>
                </View>
                <Text style={styles.stepText}>
                  You can then log in and start participating in club activities
                </Text>
              </View>
            </>
          )}
        </View>

        <View style={styles.noteCard}>
          <MaterialCommunityIcons name="alert-circle" size={20} color={designTokens.colors.warning} />
          <Text style={styles.noteText}>
            This approval process typically takes 1-2 business days. If you have any questions,
            please contact your {isClubAdmin ? 'system administrator' : 'club administrator'}.
          </Text>
        </View>

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <MaterialCommunityIcons name="logout" size={20} color={designTokens.colors.textInverse} />
          <Text style={styles.logoutButtonText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: designTokens.colors.backgroundSecondary,
  },
  container: {
    flexGrow: 1,
    backgroundColor: designTokens.colors.backgroundSecondary,
  },
  content: {
    flex: 1,
    padding: designTokens.spacing.xl,
    paddingTop: 60,
  },
  iconContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: mobileFontSizes['4xl'],
    fontWeight: 'bold',
    color: designTokens.colors.textPrimary,
    textAlign: 'center',
    marginBottom: 16,
  },
  message: {
    fontSize: mobileFontSizes.xl,
    color: designTokens.colors.textSecondary,
    textAlign: 'center',
    marginBottom: 24,
  },
  userName: {
    fontWeight: 'bold',
    color: designTokens.colors.primary,
  },
  infoCard: {
    backgroundColor: designTokens.colors.backgroundPrimary,
    borderRadius: designTokens.borderRadius.lg,
    padding: designTokens.spacing.lg,
    marginBottom: 20,
    shadowColor: designTokens.colors.textPrimary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    gap: 12,
  },
  infoText: {
    fontSize: mobileFontSizes.lg,
    color: designTokens.colors.textPrimary,
    flex: 1,
  },
  statusCard: {
    backgroundColor: designTokens.colors.backgroundPrimary,
    borderRadius: designTokens.borderRadius.lg,
    padding: designTokens.spacing.xl,
    marginBottom: 20,
    shadowColor: designTokens.colors.textPrimary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statusHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    gap: 12,
  },
  statusTitle: {
    fontSize: mobileFontSizes['2xl'],
    fontWeight: 'bold',
    color: designTokens.colors.textPrimary,
  },
  statusStep: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
    gap: 12,
  },
  stepNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: designTokens.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepNumberText: {
    color: designTokens.colors.textInverse,
    fontSize: mobileFontSizes.sm,
    fontWeight: 'bold',
  },
  stepText: {
    flex: 1,
    fontSize: mobileFontSizes.lg,
    color: designTokens.colors.textSecondary,
    lineHeight: 22,
    marginTop: 3,
  },
  noteCard: {
    flexDirection: 'row',
    backgroundColor: designTokens.colors.warningLight,
    borderRadius: designTokens.borderRadius.lg,
    padding: designTokens.spacing.lg,
    marginBottom: 24,
    gap: 12,
    borderLeftWidth: 4,
    borderLeftColor: designTokens.colors.warning,
  },
  noteText: {
    flex: 1,
    fontSize: mobileFontSizes.sm,
    color: designTokens.colors.textSecondary,
    lineHeight: 20,
  },
  logoutButton: {
    flexDirection: 'row',
    backgroundColor: designTokens.colors.primary,
    padding: designTokens.spacing.lg,
    borderRadius: designTokens.borderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  logoutButtonText: {
    color: designTokens.colors.textInverse,
    fontSize: mobileFontSizes.lg,
    fontWeight: 'bold',
  },
});

export default PendingApprovalScreen;
