import { Alert } from "@shared/ui/Alert";
import { Button } from "@shared/ui/Button";
import { FileInput } from "@shared/ui/FileInput";
import { Input } from "@shared/ui/Input";

import { type Props as IActionProps, useAction } from "../model/action";

type Props = IActionProps;

export const Upload = (props: Props) => {
  const { data, isError, error, mutate } = useAction(props);

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);

    const file = formData.get("file") as File;

    const reader = new FileReader();
    reader.onload = () => {
      mutate({
        file: reader.result as ArrayBuffer,
        name: formData.get("name") as string,
      });
    };
    reader.readAsArrayBuffer(file);
  };

  return (
    <form
      onSubmit={handleSubmit}
      name="upload swagger"
      className="flex flex-col gap-2"
    >
      <FileInput
        label="Swagger.json"
        placeholder="Select swagger.json file"
        name="file"
        accept=".json"
        required
      />

      <Input placeholder="Schema name" name="name" type="text" />

      {isError && <Alert color="red">{error}</Alert>}

      {!!data && <Alert color="green">Schema was succesfully uploaded</Alert>}

      <Button type="submit" className="mt-1">
        Upload
      </Button>
    </form>
  );
};
