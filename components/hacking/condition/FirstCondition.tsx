import { Button, HStack, Input, Select } from "native-base";
import React, { Fragment, useCallback, useState, VFC } from "react";
import { StyleSheet } from "react-native";
import { useRecoilCallback } from "recoil";
import { nesKeyAtom, nesMap } from "../../../stores/nes";
import {
  addSnapshot,
  Condition,
  ExprType,
  snapshotsAtom,
} from "../../../stores/snapshots";

export const FirstCondition: VFC = () => {
  const [condition, setCondition] = useState<Condition>({
    expr: "*",
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

  const setText = useCallback(
    (text: string) => {
      if (!text) {
        setCondition({ ...condition, value: 0 });
        return;
      }
      if (/[^0-9]/.test(text)) {
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
    },
    [condition]
  );

  const hasText = condition.expr !== "*";

  return (
    <HStack style={styles.container}>
      <Select
        accessibilityLabel="Choose condition"
        placeholder="Choose condition"
        minWidth={hasText ? 250 : 300}
        selectedValue={condition.expr}
        onValueChange={(value) =>
          setCondition({ ...condition, expr: value as ExprType })
        }
      >
        <Select.Item label="* (all)" value="*" />
        <Select.Item label="= (equal)" value="=" />
        <Select.Item label="≠ (not equal)" value="≠" />
        <Select.Item label="> (greater)" value=">" />
        <Select.Item label="≧ (greater or equal)" value="≧" />
        <Select.Item label="< (less)" value="<" />
        <Select.Item label="≦ (less or equal)" value="≦" />
      </Select>
      {hasText ? (
        <Input width={50} value={condition.value + ""} onChangeText={setText} />
      ) : (
        <Fragment />
      )}
      <Button onPress={addCondition}>+</Button>
    </HStack>
  );
};

const styles = StyleSheet.create({
  container: { alignItems: "center" },
  select: { flex: 1 },
});
