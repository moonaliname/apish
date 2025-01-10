import { type OpenAPI } from "openapi-types";

import { useConfigQuery } from "@entities/config";

import { Accordion } from "@shared/ui/Accordion";
import { Alert } from "@shared/ui/Alert";
import { Loader } from "@shared/ui/Loader";
import { Title } from "@shared/ui/Title";

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
        <Loader aria-label="Loading config and schema" />
      ) : (
        !config?.current_schema_id && <Alert>Schema isn't selected</Alert>
      )}

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
                  const trimmedPath =
                    path.slice(-1) === "/" ? path.slice(0, -1) : path;
                  const clieanedPath = trimmedPath.replace(/[{}]/g, "");
                  return (
                    <Endpoint
                      key={path}
                      doc={doc}
                      methods={pathSchema}
                      path={clieanedPath}
                    />
                  );
                },
              )}
            </Accordion>
          )}
        </>
      )}

      {configQuery.isError && <Alert>{configQuery.error}</Alert>}
      {schemaQuery.isError && <Alert>{schemaQuery.error}</Alert>}
    </>
  );
};
