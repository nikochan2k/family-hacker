// @ts-ignore
import { HStack, Text } from "native-base";
import React, { Fragment, VFC } from "react";
import { StyleSheet } from "react-native";
import { useRecoilValue } from "recoil";
import { mem } from "../components/Emulator";
import { FirstCondition } from "../components/FirstCondition";
import { FollowingCondition } from "../components/FollowingCondition";
import { snapshotsAtom } from "../stores/snapshots";

export const ConditionView: VFC = () => {
  const snapshots = useRecoilValue(snapshotsAtom);

  return (
    <HStack style={styles.container}>
      <Text>Hack condition</Text>
      {mem ? (
        snapshots.length === 0 ? (
          <FirstCondition />
        ) : (
          <FollowingCondition />
        )
      ) : (
        <Fragment />
      )}
    </HStack>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, borderColor: "#999", borderWidth: 1 },
});
