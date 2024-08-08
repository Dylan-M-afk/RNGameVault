import { StatusBar } from "expo-status-bar";
import { StyleSheet, View, ScrollView } from "react-native";
import { useState, useEffect } from 'react';
import { Button, ActivityIndicator, MD2Colors, Text } from 'react-native-paper';
import Game from '../components/Game';
import { useSQLiteContext } from "expo-sqlite";

/**
 * The main page component.
 * 
 * This component fetches game data from an SQLite database, sorts the games by rating,
 * and displays them in a scrollable view. Users can switch between different games using buttons.
 */
export default function App() {
  const db = useSQLiteContext();
  const [currentindex, switchindex] = useState(0);
  const [loading, isLoading] = useState(true);
  const [games, setGames] = useState([]);

  /**
   * Fetches game data from the SQLite database, sorts the games by rating,
   * and updates the component state.
   */
  useEffect(() => {
    async function setupIndexPage() {
      const result = await db.getAllAsync('SELECT * FROM games');
      const sortedGames = result.sort((a, b) => b.rating - a.rating);
      setGames(sortedGames);
      isLoading(false);
    }
    setupIndexPage();
  }, []);

    /**
   * Renders the component.
   * Displays a loading indicator if data is being loaded, otherwise displays the game and buttons.
   */
  return loading ? (
    <View style={styles.container}>
      <ActivityIndicator animating={true} color={MD2Colors.red800} style={styles.centeredText} />
      <Text variant="displayMedium">Loading</Text>
    </View>
  ) : (
    <View style={styles.container}>
      <Game {...games[currentindex]} />
      <ScrollView horizontal={true} style={{ flex: 1 }}>
        <View style={styles.buttonContainer}>
          {games.map((game, index) => (
            <Button
              key={index}
              mode={index === currentindex ? 'contained' : 'outlined'}
              onPress={() => switchindex(index)}
              style={styles.button}
            >
              {index + 1}
            </Button>
          ))}
        </View>
      </ScrollView>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10,
    width: '100%',
  },
  center : {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  centeredText: {
    alignSelf: 'center',
    paddingTop: 350
  },
  button: {
    margin: 5,
  },
});