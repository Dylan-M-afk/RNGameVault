import React, { useState, useEffect } from 'react';
import { useSQLiteContext } from 'expo-sqlite';
import { TextInput, View, StyleSheet, ScrollView } from 'react-native';
import Game from '../components/Game';
import { ActivityIndicator, MD2Colors, Text, Button, List } from 'react-native-paper';

/**
 * The update page component.
 * 
 * This component fetches game data from an SQLite database, displays a selection list of games,
 * and allows users to add, edit, or delete games from the database.
 */
export default function Page() {
  const db = useSQLiteContext();
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAddingNewGame, setIsAddingNewGame] = useState(false);
  const [gameForm, setGameForm] = useState({
    name: '',
    year: '',
    rating: '',
    description: '',
    imageURL: '',
  });

  /**
   * Fetches all games from the database and updates the state.
   */
  useEffect(() => {
    async function fetchData() {
      const result = await db.getAllAsync('SELECT * FROM games');
      setGames(result);
      setLoading(false);
    }
    fetchData();
  }, []);

  /**
   * Adds a new game to the database.
   * @param {string} name - The name of the game.
   * @param {string} year - The release year of the game.
   * @param {string} rating - The rating of the game.
   * @param {string} description - The description of the game.
   * @param {string} imageURL - The image URL of the game.
   */
  const addGameToDB = async (name, year, rating, description, imageURL) => {
    await db.runAsync(
      `INSERT INTO games (name, year, rating, description, imageURL) VALUES (?, ?, ?, ?, ?)`,
      name, year, rating, description, imageURL
    );
  };

  /**
   * Updates an existing game in the database by name.
   * @param {string} name - The new name of the game.
   * @param {string} year - The new release year of the game.
   * @param {string} rating - The new rating of the game.
   * @param {string} description - The new description of the game.
   * @param {string} imageURL - The new image URL of the game.
   * @param {string} currentGameName - The current name of the game being updated.
   */
  const updateGameInDB = async (name, year, rating, description, imageURL, currentGameName) => {
    await db.runAsync(
      `UPDATE games SET name = ?, year = ?, rating = ?, description = ?, imageURL = ? WHERE name = ?`,
      name, year, rating, description, imageURL, currentGameName
    );
  };

  /**
   * Removes a game from the database by its name.
   * @param {string} currentGameName - The name of the game to be removed.
   */
  const removeFromDB = async (currentGameName) => {
    await db.runAsync(`DELETE FROM games WHERE name = ?`, currentGameName);
  };

  
  /**
   * Deletes a game and updates the state accordingly.
   * @param {string} currentGameName - The name of the game to be deleted.
   */
  const deleteGame = async (currentGameName) => {
    setLoading(true);
    await removeFromDB(currentGameName);
    const updatedGames = await db.getAllAsync('SELECT * FROM games');
    setGames(updatedGames);
    setCurrentIndex(0);
    setLoading(false);
  };

  /**
   * Handles changes in the game form inputs.
   * @param {string} key - The key of the form field being changed.
   * @param {string} value - The new value of the form field.
   */
  const handleFormChange = (key, value) => {
    setGameForm(prev => ({ ...prev, [key]: value }));
  };

  /**
 * Submits the game form, either adding a new game or updating an existing one.
 */
  const submitForm = async () => {
    if (!gameForm.name || !gameForm.year || !gameForm.rating || !gameForm.description || !gameForm.imageURL) {
      alert('All fields are required!');
      return;
    }
    if (isAddingNewGame) {
      await addGameToDB(gameForm.name, gameForm.year, gameForm.rating, gameForm.description, gameForm.imageURL);
    } else {
      await updateGameInDB(
        gameForm.name, gameForm.year, gameForm.rating, gameForm.description, gameForm.imageURL,
        games[currentIndex].name
      );
    }
    const result = await db.getAllAsync('SELECT * FROM games');
    setGames(result);
    setIsAddingNewGame(false);
  };

  /**
   * Renders the component.
   * Displays a loading indicator if data is being loaded, otherwise displays the game list and form.
   */
  return loading ? (
    <View style={styles.containerView}>
      <ActivityIndicator animating={true} color={MD2Colors.red800} style={styles.centeredText} />
      <Text variant="displayMedium">Loading</Text>
    </View>
  ) : (
    <View style={styles.container}>
      {!isAddingNewGame && games.length > 0 && <Game {...games[currentIndex]} />}

      {!isAddingNewGame && (
        <ScrollView horizontal={true} style={{ flex: 1 }}>
          <View style={styles.inputContainer}>
            <List.Section>
              <List.Accordion title="Games">
                {games.map((game, index) => (
                  <List.Item
                    key={index}
                    title={game.name}
                    onPress={() => setCurrentIndex(index)}
                    style={styles.button}
                    left={props => (
                      <List.Icon {...props} icon={currentIndex === index ? 'check-circle' : 'circle-outline'} />
                    )}
                  />
                ))}
              </List.Accordion>
            </List.Section>
          </View>
        </ScrollView>
      )}

      <Text style={styles.headline}>{isAddingNewGame ? "Add New Game" : "Edit Game"}</Text>
      <TextInput
        style={styles.input}
        placeholder="Name"
        value={gameForm.name}
        onChangeText={(text) => handleFormChange('name', text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Year"
        value={gameForm.year}
        onChangeText={(text) => handleFormChange('year', text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Rating"
        value={gameForm.rating}
        onChangeText={(text) => handleFormChange('rating', text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Description"
        value={gameForm.description}
        onChangeText={(text) => handleFormChange('description', text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Image URL"
        value={gameForm.imageURL}
        onChangeText={(text) => handleFormChange('imageURL', text)}
      />
      <View style={styles.inputContainer}>
        <Button mode="contained" style={styles.button} onPress={submitForm}>
          <Text style={styles.buttonText}>{isAddingNewGame ? "Add Game" : "Update Game"}</Text>
        </Button>
        {!isAddingNewGame && games.length > 0 && (
          <Button mode="contained" style={styles.button} onPress={() => deleteGame(games[currentIndex].name)}>
            <Text style={styles.buttonText}>Delete Game</Text>
          </Button>
        )}
      </View>
      <Button mode="contained" style={styles.button} onPress={() => setIsAddingNewGame(!isAddingNewGame)}>
        <Text style={styles.buttonText}>{isAddingNewGame ? "Switch to Edit Game Mode" : "Switch to Add Game Mode"}</Text>
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  containerView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headline: {
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginHorizontal: 10,
  },
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
    borderRadius: 10,
    width: '80%',
  },
  centeredText: {
    alignSelf: 'center',
    paddingTop: 350,
  },
  button: {
    margin: 5,
  },
  buttonText: {
    color: 'white',
  }
});