import { getTypedValueFromTemplate } from "@apish/common";

import type { FieldProps } from "@pages/main/model/types";

import { Checkbox } from "@shared/ui/Checkbox";

export const BooleanField = ({
  field,
  title,
  template,
  onFieldChange,
}: FieldProps) => {
  return (
    <Checkbox
      name={field}
      label={title}
      defaultChecked={getTypedValueFromTemplate<boolean>(template, field, [
        "boolean",
      ])}
      onChange={(e) => {
        onFieldChange(field, e.target.value);
      }}
    />
  );
};
