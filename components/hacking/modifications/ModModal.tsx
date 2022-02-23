import {
  Button,
  Center,
  FormControl,
  HStack,
  Input,
  Modal,
  Text,
} from "native-base";
import React, { useCallback, useEffect, useState, VFC } from "react";
import { useRecoilCallback, useRecoilValue } from "recoil";
import {
  Modification,
  modificationAtom,
  modificationsAtom,
} from "../../../stores/modifications";
import { nesKeyAtom, nesMap } from "../../../stores/nes";
import { deepCopy, toHex } from "../../../util";

export const ModModal: VFC = () => {
  const modification = useRecoilValue(modificationAtom);
  const [mod, setMod] = useState<Modification>({
    name: "",
    address: 0,
    value: 0,
  });

  useEffect(() => {
    if (modification) {
      setMod(modification);
    }
  }, [modification]);

  const setValue = useCallback(
    async (mod: Modification, text: string, isAddress: boolean) => {
      if (!text) {
        if (isAddress) {
          setMod({ ...mod, address: 0 });
        } else {
          setMod({ ...mod, value: 0 });
        }
        return;
      }

      let value: number;
      if (isAddress) {
        if (/[^0-9A-Fa-f]/.test(text) || 4 < text.length) {
          return;
        }
        value = parseInt(text, 16);
        if (0x0800 <= value) {
          value = 0x07ff;
        }
      } else {
        if (/[^0-9]/.test(text)) {
          return;
        }
        value = parseInt(text);
        if (256 <= value) {
          value = 255;
        }
      }
      if (isNaN(value) || value < 0) {
        return;
      }
      if (isAddress) {
        setMod({ ...mod, address: value });
      } else {
        setMod({ ...mod, value });
      }
    },
    []
  );

  const setModification = useRecoilCallback(
    ({ snapshot, set }) =>
      async (mod: Modification | null) => {
        if (!mod) {
          set(modificationAtom, null);
          return;
        }

        const nesKey = await snapshot.getPromise(nesKeyAtom);
        const nes = nesMap[nesKey];
        nes.cpu.mem[mod.address] = mod.value;

        const modifications = deepCopy(
          await snapshot.getPromise(modificationsAtom)
        );
        let found = false;
        for (const m of modifications) {
          if (m.address === mod.address) {
            found = true;
            m.name = mod.name;
            m.value = mod.value;
            break;
          }
        }
        if (!found) {
          modifications.push(mod);
        }

        set(modificationsAtom, modifications);
        set(modificationAtom, null);
      },
    []
  );

  return (
    <Center>
      <Modal isOpen={!!modification} onClose={() => setModification(null)}>
        <Modal.Content maxWidth="300px">
          <Modal.CloseButton />
          <Modal.Header>Memory modification</Modal.Header>
          <Modal.Body>
            <FormControl>
              <FormControl.Label>Name (Optional)</FormControl.Label>
              <Input
                maxLength={20}
                onChangeText={(name) => setMod({ ...mod, name })}
              />
            </FormControl>
            <FormControl>
              <FormControl.Label>Address</FormControl.Label>
              <Input
                maxWidth="52px"
                maxLength={4}
                value={toHex(mod.address)}
                onChangeText={(text) => setValue(mod, text, true)}
              />
            </FormControl>
            <FormControl>
              <FormControl.Label>Value</FormControl.Label>
              <HStack alignItems="center">
                <Input
                  maxWidth="39px"
                  maxLength={3}
                  value={"" + mod.value}
                  onChangeText={(text) => setValue(mod, text, false)}
                />
                <Text marginLeft="10px" color="dark.500">
                  {toHex(mod.value, 2)}
                </Text>
              </HStack>
            </FormControl>
          </Modal.Body>
          <Modal.Footer>
            <Button.Group space={2}>
              <Button
                colorScheme="warning"
                onPress={() => setModification(mod)}
              >
                Save
              </Button>
              <Button colorScheme="light" onPress={() => setModification(null)}>
                Cancel
              </Button>
            </Button.Group>
          </Modal.Footer>
        </Modal.Content>
      </Modal>
    </Center>
  );
};
