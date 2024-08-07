import React, { useState, useEffect } from 'react';
import { useSQLiteContext } from 'expo-sqlite';
import { TextInput, View, StyleSheet, Pressable,ScrollView } from 'react-native';
import Button from '../components/Button';
import Game from '../components/Game';
import { ActivityIndicator, MD2Colors } from 'react-native-paper';
import { Text } from 'react-native-paper';

export default function Page() {
  const db = useSQLiteContext();
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentindex, switchindex] = useState(0);
  const [isAddingNewGame, setIsAddingNewGame] = useState(false);

  // state for form inputs
  const [gameForm, setGameForm] = useState({
    name: '',
    year: '',
    rating: '',
    description: '',
    imageURL: '',
  });

  useEffect(() => {
    async function fetchData() {
      const result = await db.getAllAsync('SELECT * FROM games');
      setGames(result);
      setLoading(false);
    }
    fetchData();
  }, []);

  const addGameToDB = async (name, year, rating, description, imageURL) => {
    await db.runAsync(`INSERT INTO games (name, year, rating, description, imageURL) VALUES (?, ?, ?, ?, ?)`, name, year, rating, description, imageURL);
  }

  const updategameInDB = async (name, year, rating, description, imageURL, currentGameName) => {
    await db.runAsync(`UPDATE games SET name = ?, year = ?, rating = ?, description = ?, imageURL = ? WHERE name = ?`, name, year, rating, description, imageURL, currentGameName);
  }

  const removeFromDB = async (currentGameName) => {
    await db.runAsync(`DELETE FROM games WHERE name = ?`, currentGameName);
  }

  const deleteGame = async (currentGameName) => {
    setLoading(true)
    await removeFromDB(currentGameName);
    const updatedGames = await db.getAllAsync('SELECT * FROM games');
    setGames(updatedGames);
    switchindex(0);
    setLoading(false)
  };

  const handleFormChange = (key, value) => {
    setGameForm(prev => ({ ...prev, [key]: value }));
  };

  const submitForm = async () => {
    if (!gameForm.name || !gameForm.year || !gameForm.rating || !gameForm.description || !gameForm.imageURL) {
      alert('All fields are required!');
      return;
    }
    if (isAddingNewGame) {
      await addGameToDB(gameForm.name, gameForm.year, gameForm.rating, gameForm.description, gameForm.imageURL);
    } else {
      await updategameInDB(gameForm.name, gameForm.year, gameForm.rating, gameForm.description, gameForm.imageURL, games[currentindex].name);
    }
    // Reload games after update
    const result = await db.getAllAsync('SELECT * FROM games');
    setGames(result);
    setIsAddingNewGame(false); // Reset to editing mode after submission
  };

  return loading ? (
    <View style={styles.containerView}>
      <ActivityIndicator animating={true} color={MD2Colors.red800} style={styles.centeredText}/>
      <Text style={styles.loading}>Loading!</Text>
    </View>
  ) : (
    <View style={styles.container}>
      {!isAddingNewGame && (
        <ScrollView horizontal={true} style={{ flex: 1 }}>
        <View style={styles.inputContainer}>
          {games.map((game, index) => (
            <Button key={index} label={game.name} onPress={() => switchindex(index)} isActive={currentindex === index} />
          ))}
        </View>
        </ScrollView>
      )}
      {!isAddingNewGame && games.length > 0 && <Game {...games[currentindex]} />}
      <Text>{isAddingNewGame ? "Add New Game" : "Edit Game"}</Text>
      <TextInput style={styles.input} placeholder="Name" value={gameForm.name} onChangeText={(text) => handleFormChange('name', text)} />
      <TextInput style={styles.input} placeholder="Year" value={gameForm.year} onChangeText={(text) => handleFormChange('year', text)} />
      <TextInput style={styles.input} placeholder="Rating" value={gameForm.rating} onChangeText={(text) => handleFormChange('rating', text)} />
      <TextInput style={styles.input} placeholder="Description" value={gameForm.description} onChangeText={(text) => handleFormChange('description', text)} />
      <TextInput style={styles.input} placeholder="Image URL" value={gameForm.imageURL} onChangeText={(text) => handleFormChange('imageURL', text)} />
        
      <Pressable style={styles.submitButton} onPress={submitForm}>
        <Text style={styles.submitButtonText}>{isAddingNewGame ? "Add Game" : "Update Game"}</Text>
      </Pressable>

      <Pressable style={styles.submitButton} onPress={() => setIsAddingNewGame(!isAddingNewGame)}>
        <Text style={styles.submitButtonText}>{isAddingNewGame ? "Switch to Edit" : "Switch to Add"}</Text>
      </Pressable>

      {!isAddingNewGame && games.length > 0 && (
      <Pressable style={styles.submitButton} onPress={() => deleteGame(games[currentindex].name)}>
        <Text style={styles.submitButtonText}>Delete Game</Text>
      </Pressable>
    )}
      
    </View>
  );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    header: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 20
    },
    inputContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      marginHorizontal: 10,
    },
    inputLabel: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 20
    },
    input: {
      height: 40,
      margin: 12,
      borderWidth: 1,
      padding: 10,
    },
    submitButton: {
      backgroundColor: '#007BFF',
      padding: 10,
      margin: 15,
      height: 40,
      
    },
    submitButtonText: {
      color: 'white'
    },
    loading: {
      fontSize: 25,
      fontWeight: 'bold',
      alignSelf: 'center',
      paddingTop: 10
    },
    center : {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    centeredText: {
      alignSelf: 'center',
      paddingTop: 350
    }
    });
    