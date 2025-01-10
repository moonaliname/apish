import { Upload } from "@features/schema/upload";

import { SchemaList } from "./SchemaList";

export const MainPage = () => {
  return (
    <>
      <Upload onSuccess={() => {}} />
      <SchemaList onSelect={() => {}} />
    </>
  );
};
