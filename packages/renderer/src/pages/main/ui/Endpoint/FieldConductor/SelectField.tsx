import { getTypedValueFromTemplate } from "@apish/common";

import type { FieldProps } from "@pages/main/model/types";

import { NativeSelect } from "@shared/ui/NativeSelect";

export const SelectField = ({
  schema,
  field,
  template,
  title,
  onFieldChange,
}: FieldProps) => {
  return (
    <NativeSelect
      className="w-[180px]"
      data={schema.enum}
      name={field}
      label={title}
      defaultValue={getTypedValueFromTemplate<string | number>(
        template,
        field,
        ["string", "number"],
      )}
      onChange={(e) => {
        onFieldChange(field, e.target.value);
      }}
    />
  );
};
