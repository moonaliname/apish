import { ISchema } from "@apish/common";

import { Button } from "@shared/ui/Button";

import { useLoader } from "../api/loader";

interface Props {
  onSelect: (schema: ISchema) => void;
}

export const SchemaList = ({ onSelect }: Props) => {
  const { data, isLoading } = useLoader();

  const schemas = !!data && "data" in data && data.data;

  return (
    <>
      {isLoading ? (
        <span>Loading...</span>
      ) : (
        (!schemas || !schemas.length) && <div>No schemas uploaded</div>
      )}

      <ul className="list-none m-0 p-0">
        {schemas &&
          schemas.map((schema) => {
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
              </li>
            );
          })}
      </ul>
    </>
  );
};
