// @ts-ignore
import { Box, Text } from "native-base";
import React, { Fragment, VFC } from "react";
import { useRecoilValue } from "recoil";
import { FirstCondition } from "./FirstCondition";
import { FollowingCondition } from "./FollowingCondition";
import { nesKeyAtom } from "../../../stores/nes";
import { snapshotsAtom } from "../../../stores/snapshots";

export const Hacking: VFC = () => {
  const nesKey = useRecoilValue(nesKeyAtom);
  const snapshots = useRecoilValue(snapshotsAtom);

  return nesKey ? (
    <>
      <Text size="container" bold>
        Condition
      </Text>
      <Box marginLeft={"10px"}>
        {snapshots.length === 0 ? <FirstCondition /> : <FollowingCondition />}
      </Box>
    </>
  ) : (
    <Fragment />
  );
};
