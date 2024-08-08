import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Link, usePathname } from 'expo-router';
import { Button } from 'react-native-paper';

/**
 * Navbar component that displays navigation buttons.
 * Highlights the button corresponding to the current path.
 */
function Navbar() {
  const currentPath = usePathname();

  return (
    <View style={styles.container}>
      <View style={styles.buttonContainer}>
        <Link href="/" asChild>
        <Button
            mode={currentPath === '/' ? 'contained' : 'outlined'}
            style={styles.button}
          >
            Home
          </Button>
        </Link>
        <Link href="/update" asChild>
          <Button
            mode={currentPath === '/update' ? 'contained' : 'outlined'}
            style={styles.button}
          >
            Update
          </Button>
        </Link>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    padding: 5,
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
  },
  button: {
    margin: 5,
  },
  })
export default Navbar