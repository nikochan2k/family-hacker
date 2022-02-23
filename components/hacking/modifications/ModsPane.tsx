import { Button, HStack, Text, VStack } from "native-base";
import React, { Fragment, VFC } from "react";
import { StyleSheet } from "react-native";
import { useRecoilState } from "recoil";
import { modificationsAtom } from "../../../stores/modifications";
import { Mod } from "./Mod";

export const ModsPane: VFC = () => {
  const [mods, setMods] = useRecoilState(modificationsAtom);

  if (mods.length === 0) {
    return <Fragment />;
  }

  return (
    <VStack>
      <HStack style={styles.title}>
        <Text size="container" bold>
          Modifications
        </Text>
        {0 < mods.length ? (
          <Button
            marginLeft="10px"
            variant="ghost"
            size="container"
            colorScheme="danger"
            onPress={() => setMods([])}
          >
            clear
          </Button>
        ) : (
          <Fragment />
        )}
      </HStack>
      <VStack marginLeft="10px">
        {mods.map((mod) => (
          <Mod mod={mod} />
        ))}
      </VStack>
    </VStack>
  );
};

const styles = StyleSheet.create({
  title: {
    marginTop: 5,
    alignItems: "center",
  },
});
