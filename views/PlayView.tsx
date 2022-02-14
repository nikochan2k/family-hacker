import { getDocumentAsync } from "expo-document-picker";
import { Text } from "native-base";
import React, { Fragment, useEffect, useState, VFC } from "react";
import { Dimensions, StyleSheet, TouchableOpacity } from "react-native";
import { useRecoilCallback, useSetRecoilState } from "recoil";
import { Emulator } from "../components/Emulator";
import { SCREEN_HEIGHT, SCREEN_WIDTH } from "../components/ScreenCommon";
import { nesKeyAtom } from "../stores/nes";
import { snapshotsAtom } from "../stores/snapshots";

const MAX_BYTES = (4 * 1024 * 1024) / 8;

interface Cartridge {
  romData: string;
  name: string;
  ticks: number;
}

export const PlayView: VFC = () => {
  const [cartridge, setCartridge] = useState<Cartridge>();
  const [screen, setScreen] = useState<{ width: number; height: number }>();
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

  if (!screen) {
    return <Fragment />;
  }

  return (
    <TouchableOpacity
      style={{
        flex: 1,
        backgroundColor: "#333",
        alignItems: "center",
        justifyContent: "center",
        minWidth: screen.width,
        maxWidth: screen.width,
        minHeight: screen.height,
        maxHeight: screen.height,
      }}
      onPress={openRom}
    >
      {cartridge ? (
        <Emulator
          key={cartridge.ticks}
          romData={cartridge.romData}
          ref={(ref) => setNesKey(ref?.key || "")}
        />
      ) : (
        <Text fontSize="lg" style={styles.text}>
          Press to open rom...
        </Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  button: { marginBottom: 10 },
  text: { color: "#ccc" },
});
