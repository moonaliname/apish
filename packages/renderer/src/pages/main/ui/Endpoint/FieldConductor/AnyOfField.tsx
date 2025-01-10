import {
  type IPrimitiveField,
  getNonRefSchema,
  getSchemaVariantPath,
  getValueFromTemplate,
} from "@apish/common";

import { Alert } from "@shared/ui/Alert";
import { Fieldset } from "@shared/ui/Fieldset";
import { Radio } from "@shared/ui/Radio";

import { getSchemaType } from "../../../libs/getSchemaType";
import { isPrimitive } from "../../../libs/isPrimitive";
import type { FieldProps } from "../../../model/types";

interface Props extends FieldProps {
  FieldConductor: (props: FieldProps) => React.ReactNode;
}

export const AnyOfField = ({
  doc,
  schema,
  field,
  FieldConductor,
  title,
  template,
  onFieldChange,
}: Props) => {
  const selected = getValueFromTemplate(template, `${field}.anyOf.selected`);
  return (
    <Fieldset
      legend={<span className="font-medium">{title}</span>}
      className="flex gap-2 p-3 flex-wrap"
    >
      {schema.anyOf?.map((option, index) => {
        const { data: optionSchema, error: optionSchemaError } =
          getNonRefSchema(doc, option);

        if (!optionSchema) {
          return <Alert>{optionSchemaError}</Alert>;
        }

        const type = getSchemaType(optionSchema);
        const value: IPrimitiveField = isPrimitive(optionSchema)
          ? (type as IPrimitiveField)
          : (optionSchema.title ?? "");

        return (
          <div key={index} className="flex flex-col gap-3">
            <Radio
              label={String(value)}
              name={`${field}.anyOf.selected`}
              value={String(value)}
              defaultChecked={selected ? value === selected : index === 0}
              onChange={() => {
                onFieldChange(`${field}.anyOf.selected`, value);
              }}
            />

            <FieldConductor
              doc={doc}
              schema={optionSchema}
              field={`${field}.anyOf.${value}`}
              title={getSchemaVariantPath({ schema: optionSchema })}
              template={template}
              onFieldChange={onFieldChange}
            />

            {optionSchemaError && <Alert>{optionSchemaError}</Alert>}
          </div>
        );
      })}
    </Fieldset>
  );
};
