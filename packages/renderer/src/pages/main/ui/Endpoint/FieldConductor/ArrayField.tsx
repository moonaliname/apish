import {
  SCHEMA_ITEMS_COUNT_PATH,
  SCHEMA_PAGE_SIZE_PATH,
  getNonRefSchema,
  getTypedValueFromTemplate,
} from "@apish/common";

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
  onFieldChange,
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
  const itemsCountPath = getItemsCountPath(field);
  const pageSizePath = getFieldPageSizePath(field);

  return (
    <Fieldset
      legend={
        <div className="flex gap-3 items-center">
          <span className="font-medium">{title}</span>
          <NumberInput
            name={`${field}${SCHEMA_ITEMS_COUNT_PATH}`}
            className="w-[70px]"
            defaultValue={getTypedValueFromTemplate<number>(
              template,
              itemsCountPath,
              ["number"],
            )}
            label={`total`}
            onChange={(value) => {
              onFieldChange(itemsCountPath, value);
            }}
          />
          <NumberInput
            name={`${field}${SCHEMA_PAGE_SIZE_PATH}`}
            className="w-[70px]"
            defaultValue={getTypedValueFromTemplate<number>(
              template,
              pageSizePath,
              ["number"],
            )}
            label={`page size`}
            onChange={(value) => {
              onFieldChange(pageSizePath, value);
            }}
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
              onFieldChange={onFieldChange}
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
                  onFieldChange={onFieldChange}
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

function getFieldPageSizePath(field: string): string {
  return field
    ? `${field}_apish_items_settings.${SCHEMA_PAGE_SIZE_PATH}`
    : `apish_items_settings.${SCHEMA_PAGE_SIZE_PATH}`;
}

function getItemsCountPath(field: string): string {
  return field
    ? `${field}_apish_items_settings.${SCHEMA_ITEMS_COUNT_PATH}`
    : `apish_items_settings.${SCHEMA_ITEMS_COUNT_PATH}`;
}
