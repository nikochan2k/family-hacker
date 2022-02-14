// @ts-ignore
import { HStack } from "native-base";
import React, { Fragment, VFC } from "react";
import { useRecoilValue } from "recoil";
import { FirstCondition } from "../components/FirstCondition";
import { FollowingCondition } from "../components/FollowingCondition";
import { nesKeyAtom } from "../stores/nes";
import { snapshotsAtom } from "../stores/snapshots";

export const ConditionView: VFC = () => {
  const nesKey = useRecoilValue(nesKeyAtom);
  const snapshots = useRecoilValue(snapshotsAtom);

  return (
    <HStack>
      {nesKey ? (
        snapshots.length === 0 ? (
          <FirstCondition />
        ) : (
          <FollowingCondition />
        )
      ) : (
        <Fragment />
      )}
    </HStack>
  );
};
