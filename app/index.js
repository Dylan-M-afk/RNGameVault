import { StatusBar } from "expo-status-bar";
import { StyleSheet, View, Text, ScrollView} from "react-native";
import { useState, useEffect } from 'react';
import Button from '../components/Button';
import Game from '../components/Game';
import { useSQLiteContext } from "expo-sqlite";

export default function App() {
const db = useSQLiteContext();
const [currentindex, switchindex] = useState(0)
const [loading, isLoading] = useState(true)
const [games, setGames] = useState([])


useEffect(() => {
  async function setupIndexPage() {
    const result = await db.getAllAsync('SELECT * FROM games');
    const sortedGames = result.sort((a, b) => b.rating - a.rating);
    setGames(sortedGames);
    isLoading(false);
  }
  setupIndexPage();      

}, []);

return loading ? (
  <View style={styles.container}>
    <Text style={styles.loading}>Please wait while the application loads!</Text>
  </View>
) : (
  <View style={styles.container}>
    <Game {...games[currentindex]} />
    <ScrollView horizontal={true} style={{ flex: 1 }}>
    <View style={styles.buttonContainer}>
      {games.map((game, index) => (
        <Button key={index} label={index + 1} onPress={() => switchindex(index)} isActive={index === currentindex} />
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
  loading: {
    fontSize: 18,
    textAlign: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10,
    width: '100%',
  },
});