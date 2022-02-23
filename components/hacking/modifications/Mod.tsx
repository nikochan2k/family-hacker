import { Button, HStack, Link, Text, Tooltip } from "native-base";
import React, { Fragment, VFC } from "react";
import { useRecoilCallback, useSetRecoilState } from "recoil";
import {
  Modification,
  modificationAtom,
  modificationsAtom,
} from "../../../stores/modifications";
import { toHex } from "../../../util";

export const Mod: VFC<{ mod: Modification }> = ({ mod }) => {
  const setModification = useSetRecoilState(modificationAtom);

  const remove = useRecoilCallback(
    ({ snapshot, set }) =>
      async (modToRemove: Modification) => {
        const modifications = await snapshot.getPromise(modificationsAtom);
        const newModifications: Modification[] = [];
        let found = false;
        for (const m of modifications) {
          if (m.address !== modToRemove.address) {
            newModifications.push(m);
          } else {
            found = true;
          }
        }
        if (found) {
          set(modificationsAtom, newModifications);
        }
      },
    []
  );

  return (
    <HStack alignItems="center">
      <Button
        size="container"
        minWidth="16px"
        variant="ghost"
        colorScheme="danger"
        onPress={() => remove(mod)}
      >
        ×
      </Button>
      <Text minWidth="40px" size="container" color="dark.300">
        {toHex(mod.address, 4)}
      </Text>
      <Tooltip label={"" + mod.value}>
        <Link
          minWidth="22px"
          onPress={() => setModification(mod)}
          _text={{
            color: "dark.400",
          }}
        >
          {toHex(mod.value, 2)}
        </Link>
      </Tooltip>
      {mod.name ? (
        <Text marginLeft="5px" color="dark.500" italic>
          {mod.name}
        </Text>
      ) : (
        <Fragment />
      )}
    </HStack>
  );
};
