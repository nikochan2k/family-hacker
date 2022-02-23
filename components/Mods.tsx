import { Button, HStack, Text, VStack } from "native-base";
import React, { Fragment, VFC } from "react";
import { StyleSheet } from "react-native";
import { useRecoilState } from "recoil";
import { modificationsAtom } from "../stores/modifications";
import { Mod } from "./Mod";

export const Mods: VFC = () => {
  const [mods, setMods] = useRecoilState(modificationsAtom);

  return (
    <VStack>
      <HStack style={styles.title}>
        <Text color="dark.300" size="container" bold>
          Modifications
        </Text>
        {0 < mods.length ? (
          <Button
            marginLeft="10px"
            variant="link"
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
      <VStack>
        {mods.map((mod) => (
          <Mod mod={mod} />
        ))}
      </VStack>
    </VStack>
  );
};

const styles = StyleSheet.create({
  title: {
    margin: 5,
    alignItems: "center",
  },
});
