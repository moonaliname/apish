import type { ISchema } from "@apish/common";

import { Delete } from "@features/schema/delete";

import { Alert } from "@shared/ui/Alert";
import { Button } from "@shared/ui/Button";

import { useSchemasQuery } from "../api/useSchemasQuery";

interface Props {
  onSelect: (schema: ISchema) => void;
}

export const SchemaList = ({ onSelect }: Props) => {
  const { data: schemas, isLoading } = useSchemasQuery();

  return (
    <>
      {isLoading ? (
        <span>Loading...</span>
      ) : (
        (!schemas || !schemas.length) && <Alert>No schemas uploaded </Alert>
      )}

      {schemas && (
        <ul className="list-none m-0 p-0">
          {schemas.map((schema) => {
            return (
              <li key={schema.id}>
                <Button
                  fullWidth
                  classNames={{ inner: "justify-start" }}
                  variant="subtle"
                  onClick={() => {
                    onSelect(schema);
                  }}
                >
                  {schema.name}
                </Button>
                <Delete
                  schema={{ id: schema.id, name: schema.name }}
                  onSuccess={() => {}}
                />
              </li>
            );
          })}
        </ul>
      )}
    </>
  );
};
