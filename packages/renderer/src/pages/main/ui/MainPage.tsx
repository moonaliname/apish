import { UploadModal } from "@features/schema/upload";
import { ReloadServer } from "@features/server/reload";
import { UpdateUrl } from "@features/server/updateUrl";

import { SchemaDetail } from "./SchemaDetail";
import { SchemaListModal } from "./SchemaListModal";

export const MainPage = () => {
  return (
    <div className="flex flex-col gap-4 p-4">
      <div className="flex gap-3">
        <div className="flex gap-1">
          <SchemaListModal />
          <UploadModal />
        </div>

        <div className="flex gap-1">
          <UpdateUrl />
          <ReloadServer />
        </div>
      </div>

      <SchemaDetail />
    </div>
  );
};
