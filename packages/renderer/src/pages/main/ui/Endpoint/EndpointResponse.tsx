import {
  IPrimitiveField,
  type OpenAPIResponse,
  getSchemaFromResponse,
} from "@apish/common";
import cn from "clsx";
import { type OpenAPI } from "openapi-types";
import { useRef } from "react";

import { updateTemplate } from "@pages/main/libs/updateTemplate";

import { EnableCode } from "@features/schema/enableCode";

import { Alert } from "@shared/ui/Alert";

import { useResponseQuery } from "../../api/useResponseQuery";
import { useUpdateResponse } from "../../api/useUpdateResponse";
import { FieldConductor } from "./FieldConductor";

interface Props {
  doc: OpenAPI.Document;
  path: string;
  code: string;
  responseSchema: OpenAPIResponse;
  method: string;
  scope: string;
}

export const EndpointResponse = ({
  doc,
  path,
  code,
  responseSchema,
  method,
}: Props) => {
  const { data: response, isLoading } = useResponseQuery({
    path,
    code,
    method,
  });

  const updateResponse = useUpdateResponse({
    response: { path, method, code },
  });

  const formRef = useRef<HTMLFormElement | null>(null);

  const template = response?.template ? JSON.parse(response.template) : {};

  const handleFieldChange = (field: string, value: IPrimitiveField) => {
    updateResponse.mutate({
      path,
      code,
      method,
      template: JSON.stringify(updateTemplate(template, field, value)),
    });
  };

  const { data: componentSchema, error: componentSchemaError } =
    getSchemaFromResponse(doc, responseSchema);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!componentSchema) {
    return <Alert>{componentSchemaError}</Alert>;
  }

  return (
    <div className={cn("flex", "flex-col", "gap-1")}>
      <EnableCode
        endpoint={{ path, method }}
        name={`${path}_${method}`}
        code={code}
      />
      <form ref={formRef}>
        {componentSchema.type === "object" && (
          <FieldConductor
            doc={doc}
            schema={componentSchema}
            field=""
            template={template}
            title=""
            onFieldChange={handleFieldChange}
          />
        )}
      </form>

      {componentSchemaError && <Alert>{componentSchemaError}</Alert>}
    </div>
  );
};
