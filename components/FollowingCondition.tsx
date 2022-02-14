import { Button, HStack, Input, Select } from "native-base";
import React, { Fragment, useCallback, useState, VFC } from "react";
import { StyleSheet } from "react-native";
import { useRecoilCallback } from "recoil";
import { Condition, ExprType } from "../model";
import { nesKeyAtom } from "../stores/nes";
import { addSnapshot, snapshotsAtom } from "../stores/snapshots";
import { nesMap } from "./EmulatorCommon";

export const FollowingCondition: VFC = () => {
  const [condition, setCondition] = useState<Condition>({
    expr: "≠?",
    value: 0,
  });

  const addCondition = useRecoilCallback(
    ({ snapshot, set }) =>
      async () => {
        const nesKey = await snapshot.getPromise(nesKeyAtom);
        const nes = nesMap[nesKey];
        const snapshots = await snapshot.getPromise(snapshotsAtom);
        const newSnapshots = addSnapshot(condition, snapshots, nes.cpu.mem);
        set(snapshotsAtom, newSnapshots);
      },
    [condition]
  );

  const setText = useCallback((text) => {
    if (!text) {
      setCondition({ ...condition, value: 0 });
      return;
    }
    let value = Math.trunc(text as any);
    if (isNaN(value)) {
      return;
    }
    if (value < 0) {
      value = 0;
    }
    if (256 <= value) {
      value = 255;
    }
    setCondition({ ...condition, value });
  }, []);

  return (
    <HStack style={styles.container}>
      <Select
        selectedValue={condition.expr}
        onValueChange={(value) =>
          setCondition({ ...condition, expr: value as ExprType })
        }
      >
        <Select.Item label="= (equal)" value="=" />
        <Select.Item label="≠ (not equal)" value="≠" />
        <Select.Item label="> (greater)" value=">" />
        <Select.Item label="≧ (greater or equal)" value="≧" />
        <Select.Item label="< (less)" value="<" />
        <Select.Item label="≦ (less or equal)" value="≦" />
        <Select.Item label="+ (plus from last value)" value="+" />
        <Select.Item label="- (minus from last value)" value="-" />
        <Select.Item label="≠? (not equal to last value)" value="≠?" />
        <Select.Item label=">? (greater than last value)" value=">?" />
        <Select.Item label="<? (less than last value)" value="<?" />
      </Select>
      {0 <= ["≠?", ">?", "<?"].indexOf(condition.expr) ? (
        <Input
          style={styles.input}
          value={condition.value + ""}
          onChangeText={setText}
        />
      ) : (
        <Fragment />
      )}
      <Button onPress={addCondition}>+</Button>
    </HStack>
  );
};

const styles = StyleSheet.create({
  container: { maxHeight: 30, alignItems: "center" },
  select: { flex: 1 },
  input: { width: 45 },
});
