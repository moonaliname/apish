import { getTypedValueFromTemplate } from "@apish/common";

import type { FieldProps } from "@pages/main/model/types";

import { Alert } from "@shared/ui/Alert";
import { Fieldset } from "@shared/ui/Fieldset";

interface Props extends FieldProps {
  FieldConductor: (props: FieldProps) => React.ReactNode;
}

export const JsonField = ({
  doc,
  schema,
  field,
  template,
  title,
  FieldConductor,
  onFieldChange,
}: Props) => {
  const objectValue = getTypedValueFromTemplate<object>(template, field, [
    "object",
  ]);

  if (!objectValue) return <Alert>Something went wrong</Alert>;

  const objectValueKeys = Object.keys(objectValue);

  return (
    <Fieldset
      legend={<span className="font-medium">{title}</span>}
      className="flex gap-2 p-3 flex-wrap"
    >
      {objectValueKeys.map((objectKey) => {
        if (objectKey.includes("apish_items_settings")) {
          return null;
        }

        const propertyKey = `${field}.${objectKey}`;

        return (
          <FieldConductor
            key={propertyKey}
            doc={doc}
            schema={schema}
            field={propertyKey}
            title={title ? `${title}.${propertyKey}` : propertyKey}
            template={template}
            onFieldChange={onFieldChange}
          />
        );
      })}
    </Fieldset>
  );
};
