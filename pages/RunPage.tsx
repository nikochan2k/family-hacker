import { HStack } from "native-base";
import React, { VFC } from "react";
import { StyleSheet } from "react-native";
import { ConditionView } from "../views/ConditionView";
import { PlayView } from "../views/PlayView";

export const RunPage: VFC = () => {
  return (
    <HStack style={styles.container}>
      <PlayView />
      <ConditionView />
    </HStack>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
  },
});
