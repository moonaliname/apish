import type {
  IPrimitiveField,
  ITemplate,
  OpenAPISchemaObject,
} from "@apish/common";
import type { OpenAPI } from "openapi-types";

import type { FieldProps } from "../../../model/types";
import { JsonField } from "./JsonField";

interface Props {
  doc: OpenAPI.Document;
  schema: OpenAPISchemaObject;
  field: string;
  template: ITemplate;
  title: string;
  FieldConductor: (props: FieldProps) => React.ReactNode;
  onFieldChange: (field: string, value: IPrimitiveField) => void;
}

export const ObjectField = ({
  doc,
  schema,
  field,
  template,
  title,
  FieldConductor,
  onFieldChange,
}: Props) => {
  if (schema.additionalProperties) {
    return (
      <JsonField
        key={field}
        doc={doc}
        schema={schema.additionalProperties}
        field={field}
        title={title}
        template={template}
        onFieldChange={onFieldChange}
        FieldConductor={FieldConductor}
      />
    );
  }

  if (schema.properties && Object.keys(schema.properties).length) {
    return (
      <div className="flex flex-col gap-2">
        {Object.entries(schema.properties).map(([propertyKey, schemaItem]) => {
          return (
            <FieldConductor
              key={propertyKey}
              doc={doc}
              schema={schemaItem}
              field={field ? `${field}.${propertyKey}` : propertyKey}
              title={title ? `${title}.${propertyKey}` : propertyKey}
              template={template}
              onFieldChange={onFieldChange}
            />
          );
        })}
      </div>
    );
  }

  return null;
};
