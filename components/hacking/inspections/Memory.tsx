import { Box, HStack, Link, Text } from "native-base";
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
    <HStack>
      <Box width={"40px"}>
        <Text size="container" color="dark.300">
          {toHex(byte.address, 4)}
        </Text>
      </Box>
      <Box width={"20px"}>
        {isLast ? (
          <Link
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
          <Text color="dark.400">{toHex(byte.value, 2)}</Text>
        )}
      </Box>
    </HStack>
  );
};
