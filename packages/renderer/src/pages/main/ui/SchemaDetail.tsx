import { type OpenAPI } from "openapi-types";

import { Accordion } from "@shared/ui/Accordion";
import { Alert } from "@shared/ui/Alert";
import { Title } from "@shared/ui/Title";

import { useConfigQuery } from "../api/useConfigQuery";
import { useSchemaQuery } from "../api/useSchemaQuery";
import { Endpoint } from "./Endpoint";

export const SchemaDetail = () => {
  const { data: config, ...configQuery } = useConfigQuery();

  const { data: schema, ...schemaQuery } = useSchemaQuery({
    id: config?.current_schema_id ?? 0,
  });

  const doc: OpenAPI.Document = schema ? JSON.parse(schema.doc) : null;

  return (
    <>
      {configQuery.isLoading || schemaQuery.isLoading ? (
        <span>Loading...</span>
      ) : (
        !config?.current_schema_id && <Alert>Schema wasn't selected </Alert>
      )}

      {config && <div>{config.current_schema_id}</div>}

      {schema && (
        <>
          <Title order={1}>{schema.name}</Title>

          {doc.paths && (
            <Accordion defaultValue={null}>
              {Object.entries(doc.paths).map(
                ([path, pathSchema]: [
                  string,
                  Record<string, OpenAPI.Operation>,
                ]) => {
                  return (
                    <Endpoint
                      key={path}
                      methods={pathSchema}
                      path={path}
                      doc={doc}
                    />
                  );
                },
              )}
            </Accordion>
          )}
        </>
      )}
    </>
  );
};
