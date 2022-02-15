import { Box, HStack, Text } from "native-base";
import React, { VFC } from "react";
import { Platform, StyleSheet } from "react-native";
import { Byte } from "../stores/snapshots";

export const Memory: VFC<{ byte: Byte }> = ({ byte }) => {
  return (
    <HStack style={styles.container}>
      <Box style={styles.box} width={"44px"}>
        <Text style={styles.text} color="#666">
          {byte.address.toString(16).toUpperCase().padStart(4, "0")}
        </Text>
      </Box>
      <Box style={styles.box} width={"22px"}>
        <Text style={styles.text}>
          {byte.value.toString(16).toUpperCase().padStart(2, "0")}
        </Text>
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
});
