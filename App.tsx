import { NativeBaseProvider } from "native-base";
import React from "react";
import { RecoilRoot } from "recoil";
import { RunPage } from "./pages/RunPage";

export default function App() {
  return (
    <RecoilRoot>
      <NativeBaseProvider
        config={{
          suppressColorAccessibilityWarning: true,
        }}
      >
        <RunPage />
      </NativeBaseProvider>
    </RecoilRoot>
  );
}
