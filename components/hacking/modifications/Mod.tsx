import { Box, HStack, Link, Text } from "native-base";
import React, { Fragment, VFC } from "react";
import { useSetRecoilState } from "recoil";
import { Modification, modificationAtom } from "../../../stores/modifications";
import { toHex } from "../../../util";

export const Mod: VFC<{ mod: Modification }> = ({ mod }) => {
  const setModification = useSetRecoilState(modificationAtom);

  return (
    <HStack>
      <Box width={"40px"}>
        <Text size="container" color="dark.300">
          {toHex(mod.address, 4)}
        </Text>
      </Box>
      <Box width={"20px"}>
        <Link
          onPress={() => setModification(mod)}
          _text={{
            color: "dark.400",
          }}
        >
          {toHex(mod.value, 2)}
        </Link>
      </Box>
      {mod.name ? (
        <Box marginLeft="10px">
          <Text color="dark.500" italic>
            {mod.name}
          </Text>
        </Box>
      ) : (
        <Fragment />
      )}
    </HStack>
  );
};
