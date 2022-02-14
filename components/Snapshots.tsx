import { FlatList, Text } from "native-base";
import React, { Fragment, VFC } from "react";
import { useRecoilValue } from "recoil";
import { snapshotsAtom } from "../stores/snapshots";

export const Snapshots: VFC = () => {
  const snapshots = useRecoilValue(snapshotsAtom);

  if (snapshots.length === 0) {
    return <Fragment />;
  }

  const snapshot = snapshots[snapshots.length - 1];
  const bytes = snapshot.bytes.slice(0, 20);
  return (
    <FlatList
      data={bytes}
      renderItem={({ item }) => (
        <Text>
          {item.address.toString(16)}: {item.value.toString(16)}
        </Text>
      )}
    />
  );
};
