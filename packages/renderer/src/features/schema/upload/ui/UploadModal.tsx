import { useDisclosure } from "@mantine/hooks";

import { Button } from "@shared/ui/Button";
import { Modal } from "@shared/ui/Modal";

import { Upload } from "./Upload";

export const UploadModal = () => {
  const [opened, { open, close }] = useDisclosure();
  return (
    <>
      <Button onClick={() => open()}>Upload new</Button>
      <Modal opened={opened} onClose={close}>
        <Upload onSuccess={close} />
      </Modal>
    </>
  );
};
