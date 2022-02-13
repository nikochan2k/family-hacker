import { HStack } from "native-base";
import React, { VFC } from "react";
import { StyleSheet } from "react-native";
import { PlayView } from "../views/PlayView";

export const RunPage: VFC = () => {
  return (
    <HStack style={styles.container}>
      <PlayView />
    </HStack>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
