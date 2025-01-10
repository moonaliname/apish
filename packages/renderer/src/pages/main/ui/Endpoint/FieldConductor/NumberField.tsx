import { getTypedValueFromTemplate } from "@apish/common";

import type { FieldProps } from "@pages/main/model/types";

import { NumberInput } from "@shared/ui/NumberInput";

export const NumberField = ({ schema, field, template, title }: FieldProps) => {
  return (
    <NumberInput
      name={field}
      className="w-[180px]"
      min={schema.minimum || undefined}
      max={schema.maximum || undefined}
      label={title}
      defaultValue={getTypedValueFromTemplate<string | number>(
        template,
        field,
        ["string", "number"],
      )}
    />
  );
};
