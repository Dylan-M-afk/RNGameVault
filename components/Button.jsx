import { StyleSheet, View, Pressable, Text } from 'react-native';

export default function Button({ label, onPress, isActive }) {
  return (
    <View style={styles.buttonContainer}>
      <Pressable
        style={({ pressed }) => [
          styles.button,
          isActive && styles.activeButton,
          pressed && styles.pressedButton,
        ]}
        onPress={onPress}
      >
        <Text style={styles.text}>{label}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  buttonContainer: {
    margin: 10,
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: 'gray',
    borderRadius: 5,
    alignItems: 'center',
  },
  activeButton: {
    backgroundColor: '#3498db',
  },
  pressedButton: {
    backgroundColor: '#2980b9',
  },
  text: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});