import React, { VFC } from "react";
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

  if (50 < bytes.length) {
    bytes = bytes.slice(0, 50);
  }

  return (
    <>
      {bytes.map((byte) => (
        <Memory byte={byte} isLast={current === last} />
      ))}
    </>
  );
};
