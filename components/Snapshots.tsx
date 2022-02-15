import { Button, HStack, Text, VStack } from "native-base";
import React, { Fragment, VFC } from "react";
import { StyleSheet } from "react-native";
import { useRecoilCallback, useRecoilValue } from "recoil";
import { Snapshot, snapshotsAtom } from "../stores/snapshots";
import { Memories } from "./Memories";

export const Snapshots: VFC = () => {
  const snapshots = useRecoilValue(snapshotsAtom);

  const removeSnapshot = useRecoilCallback(
    ({ set }) =>
      (snapshots: Snapshot[]) => {
        const newSnapshots = snapshots.slice(0, snapshots.length - 1);
        set(snapshotsAtom, newSnapshots);
      },
    []
  );

  if (snapshots.length === 0) {
    return <Fragment />;
  }

  const last = snapshots[snapshots.length - 1];
  return (
    <VStack>
      <Text margin={"5px"} color="#666" bold>
        Inspection
      </Text>
      <HStack marginLeft={"10px"}>
        {snapshots.map((current, index) => (
          <VStack>
            <HStack style={styles.header}>
              <Text>{index}</Text>
              {last === current ? (
                <Button
                  size="sm"
                  paddingTop="0px"
                  paddingBottom="0px"
                  paddingLeft="2px"
                  paddingRight="2px"
                  marginLeft="5px"
                  variant="ghost"
                  colorScheme="danger"
                  onPress={() => removeSnapshot(snapshots)}
                >
                  ×
                </Button>
              ) : (
                <Fragment />
              )}
            </HStack>
            <Memories current={current.bytes} last={last.bytes} />
          </VStack>
        ))}
      </HStack>
    </VStack>
  );
};

const styles = StyleSheet.create({
  header: {
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 2,
    borderBottomWidth: 1,
    borderBottomColor: "#666",
  },
});
