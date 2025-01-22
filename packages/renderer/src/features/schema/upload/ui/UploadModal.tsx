import { useDisclosure } from "@mantine/hooks";
import { IconUpload } from "@tabler/icons-react";

import { ActionIcon } from "@shared/ui/ActionIcon";
import { Modal } from "@shared/ui/Modal";
import { Tooltip } from "@shared/ui/Tooltip";

import { Upload } from "./Upload";

export const UploadModal = () => {
  const [opened, { open, close }] = useDisclosure();
  return (
    <>
      <Tooltip label="Upload new">
        <ActionIcon
          onClick={() => open()}
          variant="light"
          size="lg"
          aria-label="Upload new"
        >
          <IconUpload className="w-9/12 h-9/12" />
        </ActionIcon>
      </Tooltip>
      <Modal opened={opened} onClose={close} title="Upload new">
        <Upload onSuccess={close} />
      </Modal>
    </>
  );
};
