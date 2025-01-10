import { getTypedValueFromTemplate } from "@apish/common";

import type { FieldProps } from "@pages/main/model/types";

export const DateField = ({ field, template, title }: FieldProps) => {
  return (
    <input
      type="date"
      className="w-[180px]"
      name={field}
      title={title}
      defaultValue={getTypedValueFromTemplate<string>(template, field, [
        "string",
      ])}
    />
  );
};
