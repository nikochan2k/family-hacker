// @ts-ignore
import { NES } from "jsnes";
import React, { Fragment, PureComponent } from "react";
import { EmulatorProps } from "./EmulatorCommon";

export let mem: number[] | undefined;
export class Emulator extends PureComponent<EmulatorProps> {
  public nes?: NES;

  public render() {
    return <Fragment />;
  }

  public start = () => {};

  public stop = () => {};
}
