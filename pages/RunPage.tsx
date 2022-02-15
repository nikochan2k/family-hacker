import { HStack, VStack } from "native-base";
import React, { VFC } from "react";
import { StyleSheet } from "react-native";
import { Snapshots } from "../components/Snapshots";
import { ConditionView } from "../views/ConditionView";
import { PlayView } from "../views/PlayView";

export const RunPage: VFC = () => {
  return (
    <HStack style={styles.container}>
      <PlayView />
      <VStack>
        <ConditionView />
        <Snapshots />
      </VStack>
    </HStack>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
