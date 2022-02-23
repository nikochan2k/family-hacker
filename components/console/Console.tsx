import { getDocumentAsync } from "expo-document-picker";
import { Button, HStack, Switch, Text, View, VStack } from "native-base";
import React, { Fragment, useEffect, useState, VFC } from "react";
import { Dimensions, StyleSheet } from "react-native";
import { useRecoilCallback, useRecoilState, useSetRecoilState } from "recoil";
import { Emulator } from "./emulator/Emulator";
import { SCREEN_HEIGHT, SCREEN_WIDTH } from "./screen/ScreenCommon";
import { hackingAtom } from "../../stores/main";
import { nesKeyAtom, nesMap } from "../../stores/nes";
import { snapshotsAtom } from "../../stores/snapshots";

const MAX_BYTES = (4 * 1024 * 1024) / 8;

interface Cartridge {
  romData: string;
  name: string;
  ticks: number;
}

export const Console: VFC = () => {
  const [cartridge, setCartridge] = useState<Cartridge>();
  const [screen, setScreen] = useState<{ width: number; height: number }>();
  const [hacking, setHacking] = useRecoilState(hackingAtom);
  const setNesKey = useSetRecoilState(nesKeyAtom);

  useEffect(() => {
    const { width: w, height: h } = Dimensions.get("window");
    const widthRatio = w / SCREEN_WIDTH;
    const heightRatio = h / SCREEN_HEIGHT;
    let ratio = Math.min(widthRatio, heightRatio);
    if (2 < ratio) {
      ratio = 2;
    }
    const width = Math.round(SCREEN_WIDTH * ratio);
    const height = Math.round(SCREEN_HEIGHT * ratio);
    setScreen({ width, height });
  }, []);

  const openRom = useRecoilCallback(
    ({ set }) =>
      async () => {
        const res = await getDocumentAsync({
          multiple: false,
        });
        if (res.type === "cancel" || !res.file) return;
        const file = res.file;
        if (MAX_BYTES < file.size) return;
        const reader = new FileReader();
        const romData = await new Promise<string>((resolve, reject) => {
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = (ev) => reject(reader.error || ev);
          reader.readAsBinaryString(file);
        });
        setCartridge({ romData, name: file.name, ticks: Date.now() });
        set(snapshotsAtom, []);
      },
    []
  );

  const reset = useRecoilCallback(({ snapshot, set }) => async () => {
    const nesKey = await snapshot.getPromise(nesKeyAtom);
    const nes = nesMap[nesKey];
    nes.reloadROM();
    set(snapshotsAtom, []);
  });

  if (!screen) {
    return <Fragment />;
  }

  return (
    <VStack
      style={{
        minWidth: screen.width,
        maxWidth: screen.width,
      }}
    >
      <HStack style={{ alignItems: "center", justifyContent: "space-between" }}>
        <HStack>
          <Button onPress={openRom}>Open ROM...</Button>
          <Button
            disabled={!cartridge}
            colorScheme={cartridge ? "warning" : "light"}
            marginLeft={"10px"}
            onPress={reset}
          >
            Reset
          </Button>
        </HStack>
        {cartridge ? (
          <HStack>
            <Text color={"danger.400"}>Hack</Text>
            <Switch
              value={hacking}
              onValueChange={(value) => setHacking(value)}
              marginLeft={"5px"}
              offTrackColor="danger.100"
              onTrackColor="danger.200"
              onThumbColor="danger.500"
              offThumbColor="danger.50"
            />
          </HStack>
        ) : (
          <Fragment />
        )}
      </HStack>
      <View
        style={{
          backgroundColor: "#333",
          marginTop: 10,
          minWidth: screen.width,
          maxWidth: screen.width,
          minHeight: screen.height,
          maxHeight: screen.height,
        }}
      >
        {cartridge ? (
          <Emulator
            key={cartridge.ticks}
            romData={cartridge.romData}
            ref={(ref) => setNesKey(ref?.key || "")}
          />
        ) : (
          <Fragment />
        )}
      </View>
    </VStack>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  button: { marginBottom: 10 },
  text: { color: "#ccc" },
});
