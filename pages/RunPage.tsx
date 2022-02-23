import { HStack, VStack } from "native-base";
import React, { Fragment, VFC } from "react";
import { StyleSheet } from "react-native";
import { useRecoilValue } from "recoil";
import { ModModal } from "../components/hacking/modifications/ModModal";
import { ModsPane } from "../components/hacking/modifications/ModsPane";
import { InspectionsPane } from "../components/hacking/inspections/InspectionsPane";
import { hackingAtom } from "../stores/main";
import { Hacking } from "../components/hacking/condition/ConditionPane";
import { Console } from "../components/console/Console";

export const RunPage: VFC = () => {
  const hacking = useRecoilValue(hackingAtom);

  return (
    <HStack style={styles.container}>
      <ModModal />
      <Console />
      {hacking ? (
        <VStack marginLeft={"10px"}>
          <Hacking />
          <InspectionsPane />
          <ModsPane />
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
