import { ISchema } from "@apish/common";

import { Button } from "@shared/ui/Button";

import { type Props as IActionProps, useAction } from "../model/action";

type Props = IActionProps & {
  schema: Pick<ISchema, "id" | "name">;
};

export const Delete = ({ schema, ...rest }: Props) => {
  const { mutate } = useAction(rest);

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    mutate({ id: schema.id });
  };

  return (
    <form onSubmit={handleSubmit} name={`Delete schema ${schema.name}`}>
      <Button type="submit" color="red" variant="subtle">
        Delete
      </Button>
    </form>
  );
};
