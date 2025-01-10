import { getNonRefSchema, getSchemaVariantPath } from "@apish/common";

import { getSchemaType } from "@pages/main/libs/getSchemaType";
import { isPrimitive } from "@pages/main/libs/isPrimitive";
import type { FieldProps } from "@pages/main/model/types";

import { Alert } from "@shared/ui/Alert";
import { Fieldset } from "@shared/ui/Fieldset";
import { Radio } from "@shared/ui/Radio";

interface Props extends FieldProps {
  FieldConductor: (props: FieldProps) => React.ReactNode;
}

export const OneOfField = ({
  doc,
  schema,
  field,
  FieldConductor,
  template,
  title,
  onFieldChange,
}: Props) => {
  return (
    <Fieldset
      legend={<span className="font-medium">{title}</span>}
      className="flex gap-2 p-3 flex-wrap"
    >
      {schema.oneOf?.map((option, index) => {
        const { data: optionSchema, error: optionSchemaError } =
          getNonRefSchema(doc, option);

        if (!optionSchema) {
          return <Alert>{optionSchemaError}</Alert>;
        }

        const type = getSchemaType(optionSchema);
        const isPrimitiveField = isPrimitive(optionSchema);
        const value = isPrimitiveField ? type : optionSchema.title;

        return (
          <div key={index} className="flex flex-col gap-3">
            <Radio
              label={value}
              name={field}
              value={value}
              onChange={(e) => {
                onFieldChange(field, e.target.checked);
              }}
            />

            <FieldConductor
              doc={doc}
              schema={optionSchema}
              field={field}
              title={getSchemaVariantPath({ schema: optionSchema })}
              template={template}
              onFieldChange={onFieldChange}
            />
          </div>
        );
      })}
    </Fieldset>
  );
};
