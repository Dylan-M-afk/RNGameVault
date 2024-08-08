import { Slot } from 'expo-router';
import Navbar from '../components/Navbar';
import { useState } from 'react';
import { StyleSheet,  ScrollView } from 'react-native';
import {SQLiteProvider} from 'expo-sqlite'
import { PaperProvider } from 'react-native-paper';

/**
 * Sets up the SQLite database by creating the necessary tables and inserting initial data.
 * 
 * @param {SQLiteDatabase} db - The SQLite database instance.
 */
const setupDB = async (db) => {
    await db.execAsync(`
        PRAGMA journal_mode = 'wal';
        DROP TABLE IF EXISTS games;
        CREATE TABLE IF NOT EXISTS games (
            name TEXT PRIMARY KEY NOT NULL,
            year TEXT NOT NULL,
            rating TEXT NOT NULL,
            description TEXT NOT NULL,
            imageURL TEXT NOT NULL
        );
    `);

    const result = await db.getAllAsync('SELECT * FROM games');
    if (result.length === 0) {
        const games = [
            ["Half-Life 2", "2004", "96", "Game by Valve", "https://upload.wikimedia.org/wikipedia/en/2/25/Half-Life_2_cover.jpg"],
            ["Super Mario 64", "1996", "85", "Game by Nintendo", "https://upload.wikimedia.org/wikipedia/en/6/6a/Super_Mario_64_box_cover.jpg"],
            ["Hitman 3", "2024", "87", "Game by IO Interactive", "https://upload.wikimedia.org/wikipedia/en/8/88/Hitman_2_%282018%29_cover.jpg"]
        ];

        for (const game of games) {
            await db.runAsync('INSERT INTO games (name, year, rating, description, imageURL) VALUES (?, ?, ?, ?, ?)', ...game);
        }
    }
};

/**
 * The main layout component for the Home screen.
 * Uses both the SQLiteProvider and PaperProvider to provide database and UI functionality.
 */
export default function HomeLayout() {
    const [game, setGame] = useState(null);


  return (
    <>

    <ScrollView>
        <SQLiteProvider databaseName='games.db' onInit={setupDB}>
            <PaperProvider>
                <Slot/>
            </PaperProvider>
        </SQLiteProvider>
    </ScrollView>
    <Navbar style={styles.container}></Navbar>
    </>
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
    buttonContainer: {
        flexDirection: "row",
    },
    });