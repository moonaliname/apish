import { type OpenAPIResponse, getSchemaFromResponse } from "@apish/common";
import cn from "clsx";
import { type OpenAPI } from "openapi-types";
import { useRef } from "react";

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
  const { data: response } = useResponseQuery({
    path,
    code,
    method,
  });

  const updateResponse = useUpdateResponse({
    response: { path, method, code },
  });

  const formRef = useRef<HTMLFormElement | null>(null);

  const handleChange = () => {
    if (!formRef.current) return;
    const data = Object.fromEntries(new FormData(formRef.current).entries());
    updateResponse.mutate({
      path,
      code,
      method,
      template: JSON.stringify(data),
    });
  };

  const { data: componentSchema, error: componentSchemaError } =
    getSchemaFromResponse(doc, responseSchema);

  if (!componentSchema) {
    return <Alert>{componentSchemaError}</Alert>;
  }

  console.log("response", response?.template && JSON.parse(response.template));

  return (
    <div className={cn("flex", "flex-col", "gap-1")}>
      <EnableCode
        endpoint={{ path, method }}
        name={`${path}_${method}`}
        code={code}
      />
      <form ref={formRef} onChange={handleChange}>
        {componentSchema.type === "object" && (
          <FieldConductor
            doc={doc}
            schema={componentSchema}
            field=""
            template={response?.template ? JSON.parse(response.template) : {}}
            title=""
          />
        )}
      </form>

      {componentSchemaError && <Alert>{componentSchemaError}</Alert>}
    </div>
  );
};
