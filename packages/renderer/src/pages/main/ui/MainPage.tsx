import { UploadModal } from "@features/schema/upload";

import { SchemaDetail } from "./SchemaDetail";
import { SchemaListModal } from "./SchemaListModal";

export const MainPage = () => {
  return (
    <>
      <SchemaDetail />
      <UploadModal />
      <SchemaListModal />
    </>
  );
};
