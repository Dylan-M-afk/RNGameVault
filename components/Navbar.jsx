import React from 'react'
import { Pressable, Text, View, StyleSheet } from 'react-native'
import {Link} from 'expo-router'

function Navbar() {
    return (
      <View style={styles.container}>
        <View style={styles.buttonContainer}>
          <Link href="/" asChild>
            <Pressable style={styles.button}>
              <Text>Home</Text>
            </Pressable>
          </Link>
          <Link href="/update" asChild>
            <Pressable style={styles.button}>
              <Text>Update</Text>
            </Pressable>
          </Link>
        </View>
      </View>
    )
  }

const styles = StyleSheet.create({
    container: {
      flexDirection: 'row',
      justifyContent: 'center',
      paddingVertical: 20,
      padding: 10,
      backgroundColor: '#f0f0f0',
      alignItems: 'center',
    },
    buttonContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      width: 200,
    },
    button: {
      padding: 10,
      backgroundColor: '#ddd',
      borderRadius: 5,
    },
  })
export default Navbar