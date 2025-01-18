import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { initiateTransaction } from 'rn-upi-pay';

const PaymentScreen = () => {
  // Function to handle payment initiation
  const initiatePayment = () => {
    initiateTransaction({
      payeeName: 'Om Agrawal', // Replace with payee's name
      upi: 'agrawalrinki15@okhdfcbank', // Replace with actual UPI ID
      transactionId: `txn_${Date.now()}`, // Unique transaction ID
      currency: 'INR',
      merchantCategoryCode: '20', // Replace with the correct category code
      amount: '10', // Amount to be paid
      note: 'Test transaction', // Optional note
    })
      .then((res) => {
        Alert.alert('Payment Successful', JSON.stringify(res), [{ text: 'OK' }]);
      })
      .catch((e) => {
        Alert.alert('Payment Failed', e.message || 'Something went wrong', [
          { text: 'OK' },
        ]);
      });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>UPI Payment</Text>
      <TouchableOpacity style={styles.button} onPress={initiatePayment}>
        <Text style={styles.buttonText}>Pay ₹1</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default PaymentScreen;
