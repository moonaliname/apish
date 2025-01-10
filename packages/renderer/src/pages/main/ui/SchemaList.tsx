import type { ISchema } from "@apish/common";

import { Delete } from "@features/schema/delete";

import { Alert } from "@shared/ui/Alert";
import { Button } from "@shared/ui/Button";
import { Loader } from "@shared/ui/Loader";

import { useSchemasQuery } from "../api/useSchemasQuery";

interface Props {
  onSelect: (schema: ISchema) => void;
}

export const SchemaList = ({ onSelect }: Props) => {
  const { data: schemas, ...schemasQuery } = useSchemasQuery();

  return (
    <>
      {schemasQuery.isLoading ? (
        <Loader aria-label="Loading schemas" />
      ) : (
        (!schemas || !schemas.length) && <Alert>No schemas uploaded </Alert>
      )}

      {schemas && (
        <ul className="list-none m-0 p-0 flex flex-col gap-2">
          {schemas.map((schema) => {
            return (
              <li key={schema.id} className="flex gap-1 items-center">
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

      {schemasQuery.isError && <Alert>{schemasQuery.error}</Alert>}
    </>
  );
};
