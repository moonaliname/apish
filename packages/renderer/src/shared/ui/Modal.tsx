import { Modal as ModalMantine, ModalProps, Title } from "@mantine/core";

export const Modal = ({ title, ...rest }: ModalProps) => {
  return (
    <ModalMantine
      title={
        <Title size="h2" order={1}>
          {title}
        </Title>
      }
      {...rest}
    />
  );
};
