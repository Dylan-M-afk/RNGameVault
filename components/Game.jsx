import React from 'react';
import { StyleSheet } from 'react-native';
import { Card, Title, Paragraph } from 'react-native-paper';

function Game({ name, imageURL, description, year, rating }) {
  return (
    <Card style={styles.container}>
      <Card.Cover source={{ uri: imageURL }} style={styles.image} />
      <Card.Content>
        <Title style={styles.gameTitle}>{name}</Title>
        <Paragraph style={styles.gameInfo}>{description}</Paragraph>
        <Paragraph style={styles.gameInfo}>Year: {year}</Paragraph>
        <Paragraph style={styles.gameInfo}>Rating: {rating}</Paragraph>
      </Card.Content>
    </Card>
  );
}

const styles = StyleSheet.create( {
  container: {
    margin: 25,
    borderRadius: 10,
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