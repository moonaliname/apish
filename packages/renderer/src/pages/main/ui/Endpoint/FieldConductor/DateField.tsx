import { getTypedValueFromTemplate } from "@apish/common";

import type { FieldProps } from "@pages/main/model/types";

export const DateField = ({
  field,
  template,
  title,
  onFieldChange,
}: FieldProps) => {
  const value = getTypedValueFromTemplate<string>(template, field, ["string"]);

  return (
    <input
      type="date"
      className="w-[180px]"
      name={field}
      title={title}
      defaultValue={value}
      onChange={(e) => {
        onFieldChange(field, e.target.value);
      }}
    />
  );
};
