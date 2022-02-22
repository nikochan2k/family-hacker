import { Button, HStack, Text, VStack } from "native-base";
import React, { Fragment, useCallback, VFC } from "react";
import { StyleSheet } from "react-native";
import { useRecoilState } from "recoil";
import { snapshotsAtom } from "../stores/snapshots";
import { Memories } from "./Memories";

export const Snapshots: VFC = () => {
  const [snapshots, setSnapshots] = useRecoilState(snapshotsAtom);

  const removeLast = useCallback(() => {
    const newSnapshots = snapshots.slice(0, snapshots.length - 1);
    setSnapshots(newSnapshots);
  }, [snapshots]);

  if (snapshots.length === 0) {
    return <Fragment />;
  }

  const last = snapshots[snapshots.length - 1];
  return (
    <VStack>
      <HStack style={styles.title}>
        <Text color="dark.300" size="container" bold>
          Inspection
        </Text>
        {0 < snapshots.length ? (
          <Button
            marginLeft="10px"
            variant="link"
            size="container"
            colorScheme="danger"
            onPress={() => setSnapshots([])}
          >
            clear
          </Button>
        ) : (
          <Fragment />
        )}
      </HStack>
      <HStack marginLeft={"10px"}>
        {snapshots.map((current, index) => (
          <VStack key={index}>
            <HStack style={styles.header}>
              <Text>{index}</Text>
              {last === current ? (
                <Button
                  size="container"
                  marginLeft="5px"
                  variant="ghost"
                  colorScheme="danger"
                  onPress={removeLast}
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
  title: {
    margin: 5,
    alignItems: "center",
  },
  header: {
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 2,
    borderBottomWidth: 1,
    borderBottomColor: "#666",
  },
});
