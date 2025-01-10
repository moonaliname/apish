import { getNonRefSchema } from "@apish/common";

import { isPrimitive } from "@pages/main/libs/isPrimitive";
import type { FieldProps } from "@pages/main/model/types";

import { Accordion } from "@shared/ui/Accordion";
import { Alert } from "@shared/ui/Alert";
import { Fieldset } from "@shared/ui/Fieldset";
import { NumberInput } from "@shared/ui/NumberInput";

interface Props extends FieldProps {
  FieldConductor: (props: FieldProps) => React.ReactNode;
}

export const ArrayField = ({
  doc,
  schema,
  field,
  FieldConductor,
  title,
  template,
}: Props) => {
  if (!("items" in schema)) {
    return null;
  }

  const { data: componentSchema, error: componentSchemaError } =
    getNonRefSchema(doc, schema.items);

  if (!componentSchema) {
    return <Alert>{componentSchemaError}</Alert>;
  }

  const isPrimitiveField = isPrimitive(componentSchema);

  return (
    <Fieldset
      legend={
        <div className="flex gap-3 items-center">
          <span className="font-medium">{title}</span>
          <NumberInput
            name={`${field}_count_to_send`}
            className="w-[70px]"
            defaultValue={10}
            label={`count`}
            size="xs"
          />
        </div>
      }
    >
      <div className="flex flex-col gap-1 mt-2">
        {isPrimitiveField ? (
          <div className="flex flex-col gap-1">
            <FieldConductor
              doc={doc}
              schema={componentSchema}
              field={`${field}[0]`}
              title={title}
              template={template}
            />
          </div>
        ) : (
          <Accordion defaultValue={`Item 0`}>
            <Accordion.Item key={0} value={`Item ${0}`}>
              <Accordion.Control>{`Template`}</Accordion.Control>
              <Accordion.Panel>
                <FieldConductor
                  doc={doc}
                  schema={componentSchema}
                  field={`${field}[0]`}
                  title={title}
                  template={template}
                />
              </Accordion.Panel>
            </Accordion.Item>
          </Accordion>
        )}
      </div>
      {componentSchemaError && <Alert>{componentSchemaError}</Alert>}
    </Fieldset>
  );
};
