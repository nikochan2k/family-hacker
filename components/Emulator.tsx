// @ts-ignore
import { NES } from "jsnes";
import React, { Fragment, PureComponent } from "react";
import { EmulatorProps } from "./EmulatorCommon";

export class Emulator extends PureComponent<EmulatorProps> {
  public nes?: NES;
  public key = "";

  public render() {
    return <Fragment />;
  }

  public start = () => {};

  public stop = () => {};
}
