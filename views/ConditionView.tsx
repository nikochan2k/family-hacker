// @ts-ignore
import { Box, Text, View } from "native-base";
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
    <View>
      {nesKey ? (
        <>
          <Text margin={"5px"} color="#666" bold>
            Condition
          </Text>
          <Box marginLeft={"10px"}>
            {snapshots.length === 0 ? (
              <FirstCondition />
            ) : (
              <FollowingCondition />
            )}
          </Box>
        </>
      ) : (
        <Fragment />
      )}
    </View>
  );
};
