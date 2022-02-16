import { Box, HStack, Text } from "native-base";
import React, { useCallback, useState, VFC } from "react";
import {
  Platform,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { Byte } from "../stores/snapshots";

export const Memory: VFC<{ byte: Byte; isLast: boolean }> = (data) => {
  const [byte, setByte] = useState(data.byte);
  const [editing, setEditing] = useState(false);

  const setText = useCallback(
    (text: string) => {
      if (!text) {
        setByte({ ...byte, value: data.byte.value });
        return;
      }
      if (/[^0-9A-Fa-f]/.test(text) || 2 < text.length) {
        setByte({ ...byte, value: data.byte.value });
        return;
      }
      let value = parseInt(text, 16);
      if (isNaN(value)) {
        setByte({ ...byte, value: data.byte.value });
        return;
      }
      if (value < 0) {
        value = 0;
      }
      if (256 <= value) {
        value = 255;
      }
      setByte({ ...byte, value });
    },
    [byte]
  );

  const isLast = data.isLast;

  return (
    <HStack style={styles.container}>
      <Box style={styles.box} width={"44px"}>
        <Text style={styles.text} color="#666">
          {byte.address.toString(16).toUpperCase().padStart(4, "0")}
        </Text>
      </Box>
      <Box style={styles.box} width={"22px"}>
        {editing ? (
          <TextInput
            style={styles.text}
            value={byte.value.toString(16).toUpperCase()}
            onChangeText={setText}
            onEndEditing={() => setEditing(false)}
            onBlur={() => setEditing(false)}
          />
        ) : (
          <TouchableOpacity onPress={() => setEditing(true)}>
            <Text
              style={isLast ? styles.underline : styles.text}
              color={data.byte.value !== byte.value ? "red.500" : undefined}
            >
              {byte.value.toString(16).toUpperCase().padStart(2, "0")}
            </Text>
          </TouchableOpacity>
        )}
      </Box>
    </HStack>
  );
};

const styles = StyleSheet.create({
  container: {},
  box: {
    marginHorizontal: 2,
  },
  text: {
    textAlign: "center",
    fontFamily: Platform.OS === "android" ? "monospace" : "Courier",
  },
  underline: {
    textAlign: "center",
    fontFamily: Platform.OS === "android" ? "monospace" : "Courier",
    textDecorationLine: "underline",
  },
  input: {
    textAlign: "center",
    padding: 0,
    fontFamily: Platform.OS === "android" ? "monospace" : "Courier",
  },
});
