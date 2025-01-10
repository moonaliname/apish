import { type LoaderProps, Loader as MantineLoader } from "@mantine/core";

export const Loader = (props: LoaderProps) => {
  return (
    <MantineLoader
      className="block mx-auto"
      aria-label="Loading data"
      {...props}
    />
  );
};
