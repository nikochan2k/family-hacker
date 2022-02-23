import { Button, HStack, Text, View, VStack } from "native-base";
import React, { Fragment, useCallback, VFC } from "react";
import { StyleSheet } from "react-native";
import { useRecoilState } from "recoil";
import { Condition, snapshotsAtom } from "../stores/snapshots";
import { toHex } from "../util";
import { Memories } from "./Memories";

function condToStr(cond: Condition) {
  if (["*", "≠?", ">?", "<?"].indexOf(cond.expr) >= 0) {
    return cond.expr;
  }
  return cond.expr + toHex(cond.value, 2);
}

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
          Inspections
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
              {last === current ? (
                <Button
                  size="container"
                  minWidth="16px"
                  variant="ghost"
                  colorScheme="danger"
                  onPress={removeLast}
                >
                  ×
                </Button>
              ) : (
                <View minWidth="16px" />
              )}
              <Text>{index + 1}</Text>
              <Text marginLeft="4px" color="dark.500" italic>
                {condToStr(current.condition)}
              </Text>
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
    justifyContent: "flex-start",
    marginRight: 2,
    borderBottomWidth: 1,
    borderBottomColor: "#666",
  },
});
