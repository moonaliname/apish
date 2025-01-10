import { Upload } from "@features/schema/upload";

import { useUpdateConfig } from "../api/useUpdateConfig";
import { SchemaDetail } from "./SchemaDetail";
import { SchemaList } from "./SchemaList";

export const MainPage = () => {
  const { mutate } = useUpdateConfig();
  return (
    <>
      <SchemaDetail />
      <Upload onSuccess={() => {}} />
      <SchemaList
        onSelect={(schema) => {
          mutate({ current_schema_id: schema.id });
        }}
      />
    </>
  );
};
