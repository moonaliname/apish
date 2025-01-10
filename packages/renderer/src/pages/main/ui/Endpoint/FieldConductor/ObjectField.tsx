import type { ITemplate, OpenAPISchemaObject } from "@apish/common";
import type { OpenAPI } from "openapi-types";

import type { FieldProps } from "../../../model/types";

interface Props {
  doc: OpenAPI.Document;
  schema: OpenAPISchemaObject;
  field: string;
  template: ITemplate;
  title: string;
  FieldConductor: (props: FieldProps) => React.ReactNode;
}

export const ObjectField = ({
  doc,
  schema,
  field,
  template,
  title,
  FieldConductor,
}: Props) => {
  if (!schema.properties || Object.keys(schema.properties).length == 0) {
    return null;
  }

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
          />
        );
      })}
    </div>
  );
};
