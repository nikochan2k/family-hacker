import { Button, HStack, Input, Select } from "native-base";
import React, { Fragment, useState, VFC } from "react";
import { StyleSheet } from "react-native";
import { useRecoilCallback } from "recoil";
import { Condition, ExprType } from "../model";
import { addSnapshot, snapshotsAtom } from "../stores/snapshots";
import { mem } from "./Emulator";

export const FirstCondition: VFC = () => {
  const [cond, setCond] = useState<Condition>({ expr: "*", value: 0 });

  const addCondition = useRecoilCallback(
    ({ snapshot, set }) =>
      async () => {
        if (!Array.isArray(mem)) return;
        const snapshots = await snapshot.getPromise(snapshotsAtom);
        const newSnapshots = addSnapshot(cond, snapshots, mem);
        set(snapshotsAtom, newSnapshots);
      },
    [cond]
  );

  return (
    <HStack style={styles.container}>
      <Select
        selectedValue={cond.expr}
        onValueChange={(value) => setCond({ ...cond, expr: value as ExprType })}
      >
        <Select.Item label="* (all)" value="*" />
        <Select.Item label="= (equal)" value="=" />
        <Select.Item label="≠ (not equal)" value="≠" />
        <Select.Item label="> (greater)" value=">" />
        <Select.Item label="≧ (greater or equal)" value="≧" />
        <Select.Item label="< (less)" value="<" />
        <Select.Item label="≦ (less or equal)" value="≦" />
      </Select>
      {cond.expr !== "*" ? (
        <Input
          style={styles.input}
          value={cond.value + ""}
          onChangeText={(text) => {
            if (!text) {
              setCond({ ...cond, value: 0 });
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
            setCond({ ...cond, value });
          }}
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
