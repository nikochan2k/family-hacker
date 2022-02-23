import { HStack, Link, Text, Tooltip } from "native-base";
import React, { VFC } from "react";
import { useSetRecoilState } from "recoil";
import { modificationAtom } from "../../../stores/modifications";
import { Byte } from "../../../stores/snapshots";
import { toHex } from "../../../util";

export const Memory: VFC<{ byte: Byte; isLast: boolean }> = ({
  byte,
  isLast,
}) => {
  const setMod = useSetRecoilState(modificationAtom);

  return (
    <HStack alignItems="center">
      <Text minWidth="40px" size="container" color="dark.300">
        {toHex(byte.address, 4)}
      </Text>
      <Tooltip label={"" + byte.value}>
        {isLast ? (
          <Link
            minWidth="22px"
            onPress={() =>
              setMod({ name: "", address: byte.address, value: byte.value })
            }
            _text={{
              color: "dark.400",
            }}
          >
            {toHex(byte.value, 2)}
          </Link>
        ) : (
          <Text minWidth="20px" color="dark.400">
            {toHex(byte.value, 2)}
          </Text>
        )}
      </Tooltip>
    </HStack>
  );
};
