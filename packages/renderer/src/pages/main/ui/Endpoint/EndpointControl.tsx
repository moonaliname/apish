import { Center } from "@mantine/core";

import { ToggleProxy } from "@features/schema/toggleProxy";

import { Accordion, type AccordionControlProps } from "@shared/ui/Accordion";

interface Props extends AccordionControlProps {
  endpoint: { path: string; method: string };
}

export const EndpointControl = ({ endpoint, ...props }: Props) => {
  return (
    <Center>
      <Accordion.Control {...props} />
      <ToggleProxy {...endpoint} />
    </Center>
  );
};
