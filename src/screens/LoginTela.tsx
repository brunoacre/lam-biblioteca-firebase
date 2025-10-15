import React, { useState, useEffect } from 'react';
import { SafeAreaView, View, Text, TextInput, TouchableOpacity, FlatList, Modal, StyleSheet, Alert, } from 'react-native';

import { auth, db } from '../firebaseConfig';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut, } from 'firebase/auth';

export default function App() {
  // Estado de autenticação e tela
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isLoginScreen, setIsLoginScreen] = useState(true);

  // Campos de autenticação
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');

  // Hook para monitorar o estado de autenticação do usuário
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return unsubscribe; // Limpa o listener ao desmontar
  }, []);


  // --- Funções de Autenticação ---
  const handleLogin = () => {
    signInWithEmailAndPassword(auth, email, senha)
      .catch(error => Alert.alert("Erro no Login", error.message));
  };

  const handleCadastro = () => {
    createUserWithEmailAndPassword(auth, email, senha)
      .then(() => {
        Alert.alert("Sucesso", "Usuário cadastrado! Faça o login.");
        setIsLoginScreen(true);
      })
      .catch(error => Alert.alert("Erro no Cadastro", error.message));
  };


  // --- Renderização ---
  if (loading) {
    return <View style={styles.container}><Text>Carregando...</Text></View>;
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>{isLoginScreen ? 'Login' : 'Cadastro'}</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Senha"
        value={senha}
        onChangeText={setSenha}
        secureTextEntry
      />
      <TouchableOpacity
        style={styles.button}
        onPress={isLoginScreen ? handleLogin : handleCadastro}>
        <Text style={styles.buttonText}>{isLoginScreen ? 'Entrar' : 'Cadastrar'}</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => setIsLoginScreen(!isLoginScreen)}>
        <Text style={styles.switchText}>
          {isLoginScreen ? 'Criar uma conta' : 'Já tenho uma conta'}
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}



const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
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
});


