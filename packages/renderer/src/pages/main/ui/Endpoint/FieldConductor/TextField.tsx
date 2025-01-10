import { getTypedValueFromTemplate } from "@apish/common";

import type { FieldProps } from "@pages/main/model/types";

import { Input } from "@shared/ui/Input";

export const TextField = ({ schema, field, title, template }: FieldProps) => {
  return (
    <Input.Wrapper label={title}>
      <Input
        className="w-[180px]"
        type="text"
        name={field}
        minLength={schema.minLength || undefined}
        maxLength={schema.maxLength || undefined}
        defaultValue={getTypedValueFromTemplate<string | number>(
          template,
          field,
          ["string", "number"],
        )}
      />
    </Input.Wrapper>
  );
};
