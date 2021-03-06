import { getDocumentAsync } from "expo-document-picker";
import { Button, HStack, Switch, Text, View, VStack } from "native-base";
import React, { Fragment, useEffect, useState, VFC } from "react";
import { Dimensions, StyleSheet } from "react-native";
import { useRecoilCallback, useRecoilState, useSetRecoilState } from "recoil";
import { download } from "../../download";
import { hackingAtom } from "../../stores/main";
import { Modification, modificationsAtom } from "../../stores/modifications";
import { nesKeyAtom, nesMap } from "../../stores/nes";
import { snapshotsAtom } from "../../stores/snapshots";
import { Emulator } from "./emulator/Emulator";
import { SCREEN_HEIGHT, SCREEN_WIDTH } from "./screen/ScreenCommon";

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

  const open = useRecoilCallback(
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
        set(modificationsAtom, []);
      },
    []
  );

  const reset = useRecoilCallback(({ snapshot, set }) => async () => {
    const nesKey = await snapshot.getPromise(nesKeyAtom);
    const nes = nesMap[nesKey];
    nes.reloadROM();
    set(snapshotsAtom, []);
  });

  const load = useRecoilCallback(({ snapshot, set }) => async () => {
    const picked = await getDocumentAsync({
      multiple: false,
      type: "text/json",
    });
    if (picked.type === "cancel") {
      return;
    }
    const fileList = picked.output;
    if (!fileList || fileList.length === 0) {
      return;
    }
    const file = fileList[0] as File;
    const reader = new FileReader();
    const json = await new Promise<string>((resolve, reject) => {
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (ev) => reject(reader.error || ev);
      reader.readAsText(file);
    });
    const obj = JSON.parse(json);

    const nesKey = await snapshot.getPromise(nesKeyAtom);
    const nes = nesMap[nesKey];
    nes.fromJSON(obj);

    const modifications = obj.modifications as Modification[];
    if (Array.isArray(modifications)) {
      set(modificationsAtom, modifications);
    }
  });

  const save = useRecoilCallback(({ snapshot }) => async () => {
    const nesKey = await snapshot.getPromise(nesKeyAtom);
    const nes = nesMap[nesKey];
    const obj = nes.toJSON();
    obj.modifications = await snapshot.getPromise(modificationsAtom);
    const json = JSON.stringify(obj);
    download(json);
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
          <Button onPress={open}>Open</Button>
          {cartridge ? (
            <>
              <Button colorScheme="warning" marginLeft={"10px"} onPress={reset}>
                Reset
              </Button>
              <Button colorScheme="success" marginLeft={"10px"} onPress={save}>
                Save
              </Button>
              <Button colorScheme="success" marginLeft={"10px"} onPress={load}>
                Load
              </Button>
            </>
          ) : (
            <Fragment />
          )}
        </HStack>
        {cartridge ? (
          <HStack>
            <Text color={"rose.900"} bold>
              Hack
            </Text>
            <Switch
              value={hacking}
              onValueChange={(value) => setHacking(value)}
              marginLeft={"5px"}
              offTrackColor="rose.100"
              onTrackColor="rose.200"
              onThumbColor="rose.900"
              offThumbColor="rose.50"
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
