import React, { useState, useEffect } from 'react';
import { SafeAreaView, View, Text, TextInput, TouchableOpacity, FlatList, Modal, StyleSheet, Alert, } from 'react-native';

import { auth, db } from '../firebaseConfig';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut, } from 'firebase/auth';
import { getFirestore, collection, addDoc, updateDoc, deleteDoc, doc, query, where, onSnapshot, } from 'firebase/firestore';



export default function LivroTela() {
  // Estado de autenticação e tela
  const [user, setUser] = useState(null);

  // Estados do CRUD de Livros
  const [livros, setLivros] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [titulo, setTitulo] = useState('');
  const [autor, setAutor] = useState('');
  const [livroEditando, setLivroEditando] = useState(null);

  // Hook para monitorar o estado de autenticação do usuário
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return unsubscribe; // Limpa o listener ao desmontar
  }, []);

  // Hook para buscar os livros do usuário logado em tempo real
  useEffect(() => {
    if (!user) {
      setLivros([]);
      return;
    }

    const livrosCollectionRef = collection(db, 'livros');
    const q = query(livrosCollectionRef, where('userId', '==', user.uid));

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const livrosData = [];
      querySnapshot.forEach((doc) => {
        livrosData.push({ id: doc.id, ...doc.data() });
      });
      setLivros(livrosData);
    });

    return unsubscribe; // Limpa o listener ao desmontar
  }, [user]);

   // --- Funções do CRUD ---
  const handleSalvarLivro = async () => {
    if (titulo.trim() === '' || autor.trim() === '') {
      Alert.alert("Erro", "Título e autor são obrigatórios.");
      return;
    }
    try {
      if (livroEditando) {
        // Atualiza um livro
        const livroDocRef = doc(db, 'livros', livroEditando.id);
        await updateDoc(livroDocRef, { titulo, autor });
      } else {
        // Adiciona um novo livro
        await addDoc(collection(db, 'livros'), { titulo, autor, userId: user.uid });
      }
      closeModal();
    } catch (error) {
      Alert.alert("Erro", "Não foi possível salvar o livro.");
    }
  };

  const handleExcluirLivro = (id) => {
    Alert.alert(
      "Confirmar Exclusão",
      "Tem certeza que deseja excluir este livro?",
      [
        { text: "Cancelar" },
        {
          text: "Excluir",
          onPress: async () => {
            const livroDocRef = doc(db, 'livros', id);
            await deleteDoc(livroDocRef);
          },
        }
      ]
    );
  };

  const handleLogout = () => {
    signOut(auth);
  };

  // --- Funções do Modal ---
  const openModal = (livro = null) => {
    if (livro) {
      setLivroEditando(livro);
      setTitulo(livro.titulo);
      setAutor(livro.autor);
    } else {
      setLivroEditando(null);
      setTitulo('');
      setAutor('');
    }
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Meus Livros</Text>
        <TouchableOpacity onPress={handleLogout}>
          <Text style={styles.logoutText}>Sair</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={livros}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={styles.livroItem}>
            <View>
              <Text style={styles.livroTitulo}>{item.titulo}</Text>
              <Text style={styles.livroAutor}>{item.autor}</Text>
            </View>
            <View style={{ flexDirection: 'row' }}>
              <TouchableOpacity onPress={() => openModal(item)}>
                <Text style={styles.editButton}>Editar</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleExcluirLivro(item.id)}>
                <Text style={styles.deleteButton}>Excluir</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
      <TouchableOpacity style={styles.fab} onPress={() => openModal()}>
        <Text style={styles.fabIcon}>+</Text>
      </TouchableOpacity>
      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modalView}>
            <Text style={styles.title}>{livroEditando ? 'Editar Livro' : 'Novo Livro'}</Text>
            <TextInput style={styles.input} placeholder="Título" value={titulo} onChangeText={setTitulo} />
            <TextInput style={styles.input} placeholder="Autor" value={autor} onChangeText={setAutor} />
            <TouchableOpacity style={styles.button} onPress={handleSalvarLivro}>
              <Text style={styles.buttonText}>Salvar</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={closeModal}>
              <Text style={styles.switchText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
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


