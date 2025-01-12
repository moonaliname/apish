import { ISchema } from "@apish/common";
import { IconTrash } from "@tabler/icons-react";

import { ActionIcon } from "@shared/ui/ActionIcon";
import { Tooltip } from "@shared/ui/Tooltip";

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
      <Tooltip label="Delete">
        <ActionIcon
          type="submit"
          color="red"
          variant="subtle"
          aria-label="Delete"
        >
          <IconTrash className="w-9/12 h-9/12" />
        </ActionIcon>
      </Tooltip>
    </form>
  );
};
