import { useDisclosure } from "@mantine/hooks";

import { useUpdateConfig } from "@entities/config";

import { Button } from "@shared/ui/Button";
import { Modal } from "@shared/ui/Modal";

import { SchemaList } from "./SchemaList";

export const SchemaListModal = () => {
  const [opened, { open, close }] = useDisclosure();
  const { mutate } = useUpdateConfig();
  return (
    <>
      <Button variant="outline" onClick={() => open()}>
        Schemas
      </Button>

      <Modal opened={opened} onClose={close} title="Schemas">
        <SchemaList
          onSelect={(schema) => {
            mutate({ current_schema_id: schema.id });
          }}
        />
      </Modal>
    </>
  );
};
