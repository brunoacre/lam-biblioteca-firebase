import React, { useState, useEffect } from 'react';
import { SafeAreaView, View, Text, TextInput, TouchableOpacity, FlatList, Modal, StyleSheet, Alert, ImageBackground, } from 'react-native';

import { auth, db } from './src/firebaseConfig';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut, } from 'firebase/auth';
import { getFirestore, collection, addDoc, updateDoc, deleteDoc, doc, query, where, onSnapshot, } from 'firebase/firestore';

import { useFonts } from 'expo-font';



export default function App() {

  const primaryColor = '#3498db';
  const [loaded] = useFonts({'digital-7': require('./assets/fonts/digital-7.ttf'),
  });
  const imagem = { uri: 'https://legacy.reactjs.org/logo-og.png' };

  return (
    <View style={styles.container}>
      <ImageBackground source={imagem} resizeMode="cover" style={styles.image} >
        <Text style={styles.text}>Teste Teste 1 </Text>
        <Text style={[styles.title, {fontFamily: 'digital-7'}]}>Teste Teste 2 </Text>
        <Text style={{ fontFamily: 'digital-7', fontSize: 50, color: 'white' }}>Teste Teste</Text>
      </ImageBackground>
    </View>
  )
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  image: {
    flex: 1,
    justifyContent: 'center',
  },
  text: {
    color: 'yellow',
    fontFamily: 'digital-7',
    fontSize: 42,
    lineHeight: 84,
    textAlign: 'center',
    backgroundColor: '#000000c0',

  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    marginBottom: 16,
    textAlign: 'center',
    color: 'yellow',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 8,
    borderRadius: 4,
    backgroundColor: '#fff',
  },
  button: {
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 4,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  switchText: {
    color: '#007bff',
    textAlign: 'center',
    marginTop: 16,
  },
  logoutText: {
    color: '#dc3545',
  },
  livroItem: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 4,
    marginBottom: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  livroTitulo: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  livroAutor: {
    fontSize: 14,
    color: 'gray',
  },
  editButton: {
    color: '#ffc107',
    marginRight: 16,
  },
  deleteButton: {
    color: '#dc3545',
  },
  fab: {
    position: 'absolute',
    right: 30,
    bottom: 30,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#007bff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fabIcon: {
    color: '#fff',
    fontSize: 24,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalView: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 20,
  },
});


