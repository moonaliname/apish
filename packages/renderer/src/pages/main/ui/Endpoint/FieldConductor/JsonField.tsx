import { getValueFromTemplate } from "@apish/common";

import type { FieldProps } from "@pages/main/model/types";

import { Fieldset } from "@shared/ui/Fieldset";
import { JsonInput } from "@shared/ui/JsonInput";

interface Props extends Omit<FieldProps, "schema"> {
  FieldConductor: (props: FieldProps) => React.ReactNode;
  schema: Pick<FieldProps, "schema">["schema"] | true;
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
  const objectValue = getValueFromTemplate(template, field);

  return (
    <Fieldset
      legend={<span className="font-medium">{title}</span>}
      className="flex gap-2 p-3 flex-wrap"
    >
      {typeof schema === "boolean" ||
      !objectValue ||
      typeof objectValue !== "object" ? (
        <JsonInput
          className="full"
          validationError="Invalid JSON"
          onChange={(value) => {
            try {
              const objectValue = JSON.parse(value);
              onFieldChange(field, objectValue);
            } catch (_e) {
              /* empty */
            }
          }}
        />
      ) : (
        <>
          {Object.keys(objectValue).map((objectKey) => {
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
        </>
      )}
    </Fieldset>
  );
};
