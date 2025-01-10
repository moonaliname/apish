import { Center } from "@mantine/core";

import { Accordion, type AccordionControlProps } from "@shared/ui/Accordion";

export const EndpointControl = ({ ...props }: AccordionControlProps) => {
  return (
    <Center>
      <Accordion.Control {...props} />
    </Center>
  );
};
