import { getTypedValueFromTemplate } from "@apish/common";

import type { FieldProps } from "@pages/main/model/types";

import { Checkbox } from "@shared/ui/Checkbox";

export const BooleanField = ({ field, title, template }: FieldProps) => {
  return (
    <Checkbox
      name={field}
      label={title}
      size="xs"
      defaultChecked={getTypedValueFromTemplate<boolean>(template, field, [
        "boolean",
      ])}
    />
  );
};
