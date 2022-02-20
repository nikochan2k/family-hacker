import { Text } from "native-base";
import React, { Fragment, VFC } from "react";
import { Byte } from "../stores/snapshots";
import { Memory } from "./Memory";

export const Memories: VFC<{ current: Byte[]; last: Byte[] }> = ({
  current,
  last,
}) => {
  let bytes: Byte[];
  if (current === last) {
    bytes = current;
  } else {
    bytes = current.filter((byte) =>
      last.some((b) => b.address === byte.address)
    );
  }

  let more = 16 < bytes.length;
  if (more) {
    bytes = bytes.slice(0, 16);
  }

  return (
    <>
      {bytes.map((byte) => (
        <Memory byte={byte} isLast={current === last} />
      ))}
      {more ? <Text>...</Text> : <Fragment />}
    </>
  );
};
