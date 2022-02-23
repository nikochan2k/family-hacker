import { Box, HStack, Input, Link, Text } from "native-base";
import React, { useCallback, useRef, useState, VFC } from "react";
import { Platform, StyleSheet } from "react-native";
import { useRecoilCallback } from "recoil";
import { nesKeyAtom } from "../stores/nes";
import { Byte } from "../stores/snapshots";
import { nesMap } from "./EmulatorCommon";

export const Memory: VFC<{ byte: Byte; isLast: boolean }> = (data) => {
  const [byte, setByte] = useState(data.byte);
  const [editing, setEditing] = useState(false);
  const submited = useRef(false);

  const setText = useCallback(
    async (text: string) => {
      if (!text) {
        setByte({ ...byte, value: 0 });
        return;
      }
      if (/[^0-9A-Fa-f]/.test(text) || 2 < text.length) {
        return;
      }
      let value = parseInt(text, 16);
      if (isNaN(value)) {
        return;
      }
      if (value < 0) {
        value = 0;
      }
      if (256 <= value) {
        value = 255;
      }
      setByte({ ...byte, value });
    },
    [byte]
  );

  const onSubmit = useRecoilCallback(
    ({ snapshot }) =>
      async () => {
        const nesKey = await snapshot.getPromise(nesKeyAtom);
        const nes = nesMap[nesKey];
        nes.cpu.mem[byte.address] = byte.value;
        submited.current = true;
        setEditing(false);
      },
    [byte]
  );

  const onBlur = useCallback(async () => {
    if (submited.current) {
      submited.current = false;
    } else {
      setByte(data.byte);
    }
    setEditing(false);
  }, [byte]);

  const isLast = data.isLast;

  return (
    <HStack style={styles.container}>
      <Box style={styles.box} width={"44px"}>
        <Text size="container" color="dark.300">
          {byte.address.toString(16).toUpperCase().padStart(4, "0")}
        </Text>
      </Box>
      <Box style={styles.box} width={"22px"}>
        {editing ? (
          <Input
            margin={0}
            padding={0}
            size="container"
            value={byte.value.toString(16).toUpperCase()}
            onChangeText={setText}
            onSubmitEditing={onSubmit}
            onBlur={onBlur}
          />
        ) : (
          <Link
            onPress={() => setEditing(true)}
            _text={{
              color: data.byte.value !== byte.value ? "red.500" : "dark.300",
            }}
          >
            {byte.value.toString(16).toUpperCase().padStart(2, "0")}
          </Link>
        )}
      </Box>
    </HStack>
  );
};

const styles = StyleSheet.create({
  container: {},
  box: {
    marginHorizontal: 2,
  },
  text: {
    textAlign: "center",
    fontFamily: Platform.OS === "android" ? "monospace" : "Courier",
  },
  underline: {
    textAlign: "center",
    fontFamily: Platform.OS === "android" ? "monospace" : "Courier",
    textDecorationLine: "underline",
  },
  input: {
    textAlign: "center",
    padding: 0,
    fontFamily: Platform.OS === "android" ? "monospace" : "Courier",
  },
});
