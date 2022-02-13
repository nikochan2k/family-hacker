import { NativeBaseProvider } from "native-base";
import React from "react";
import { RunPage } from "./pages/RunPage";

export default function App() {
  return (
    <NativeBaseProvider>
      <RunPage />
    </NativeBaseProvider>
  );
}
