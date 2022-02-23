import { HStack, VStack } from "native-base";
import React, { Fragment, VFC } from "react";
import { StyleSheet } from "react-native";
import { useRecoilValue } from "recoil";
import { ModModal } from "../components/ModModal";
import { Mods } from "../components/Mods";
import { Snapshots } from "../components/Snapshots";
import { hackingAtom } from "../stores/main";
import { ConditionView } from "../views/ConditionView";
import { PlayView } from "../views/PlayView";

export const RunPage: VFC = () => {
  const hacking = useRecoilValue(hackingAtom);

  return (
    <HStack style={styles.container}>
      <ModModal />
      <PlayView />
      {hacking ? (
        <VStack marginLeft={"10px"}>
          <ConditionView />
          <Snapshots />
          <Mods />
        </VStack>
      ) : (
        <Fragment />
      )}
    </HStack>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },
});
