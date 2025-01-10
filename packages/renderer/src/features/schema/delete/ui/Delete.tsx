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
    <form
      onSubmit={handleSubmit}
      name={`delete schema ${schema.name}`}
      className="flex flex-col gap-2"
    >
      <Button type="submit" className="mt-1">
        Delete
      </Button>
    </form>
  );
};
