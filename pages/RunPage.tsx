import { HStack, VStack } from "native-base";
import React, { Fragment, VFC } from "react";
import { StyleSheet } from "react-native";
import { useRecoilValue } from "recoil";
import { Console } from "../components/console/Console";
import { Hacking } from "../components/hacking/condition/ConditionPane";
import { InspectionsPane } from "../components/hacking/inspections/InspectionsPane";
import { ModModal } from "../components/hacking/modifications/ModModal";
import { ModsPane } from "../components/hacking/modifications/ModsPane";
import { hackingAtom } from "../stores/main";

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
    marginTop: 10,
  },
});
