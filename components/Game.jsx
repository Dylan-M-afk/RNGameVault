import React, { useContext } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';

function Game({ name, imageURL, description, year, rating }) {
  return (
    <View style={styles.container}>
      <Text style={styles.gameTitle}>{name}</Text>
      <Image source={{ uri: imageURL }} style={styles.image} />
      <Text style={styles.gameInfo}>{description}</Text>
      <Text style={styles.gameInfo}>Year: {year}</Text>
      <Text style={styles.gameInfo}>Rating: {rating}</Text>
    </View>
    );
  };

const styles = StyleSheet.create( {
    container: {
        flex: 1,
        backgroundColor: '#f8f8f8',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
        margin: 20,
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.8,
        shadowRadius: 2,
        elevation: 5,
    },
    gameTitle: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#333',
    },
    gameInfo: {
        fontSize: 18,
        marginBottom: 5,
        color: '#666',
    },
    image: {
        width: 320,
        height: 440,
        borderRadius: 10,
        marginBottom: 10,
    }
})

export default Game;