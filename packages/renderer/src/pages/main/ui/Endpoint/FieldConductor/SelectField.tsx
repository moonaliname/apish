import { getTypedValueFromTemplate } from "@apish/common";

import type { FieldProps } from "@pages/main/model/types";

import { NativeSelect } from "@shared/ui/NativeSelect";

export const SelectField = ({ schema, field, template, title }: FieldProps) => {
  return (
    <NativeSelect
      className="w-[180px]"
      data={schema.enum}
      name={field}
      label={title}
      size="xs"
      defaultValue={getTypedValueFromTemplate<string | number>(
        template,
        field,
        ["string", "number"],
      )}
    />
  );
};
