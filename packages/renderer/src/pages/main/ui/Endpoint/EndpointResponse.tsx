import cn from "clsx";
import { OpenAPI } from "openapi-types";
import { useRef } from "react";

import { getSchemaFromComponents } from "@shared/libs/openApi/getSchemaFromComponents";
import { type OpenAPIResponse } from "@shared/libs/openApi/types";
import { Alert } from "@shared/ui/Alert";

import { useResponseQuery } from "../../api/useResponseQuery";
import { useUpdateResponse } from "../../api/useUpdateResponse";

interface Props {
  doc: OpenAPI.Document;
  path: string;
  code: number;
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

  const componentSchema = getSchemaFromComponents(doc, responseSchema);

  if ("error" in componentSchema) {
    return (
      <Alert>
        {componentSchema.error} {JSON.stringify(responseSchema)}
      </Alert>
    );
  }

  return (
    <div className={cn("flex", "flex-col", "gap-1")}>
      <form ref={formRef} onChange={handleChange}>
        {componentSchema.message && <Alert>{componentSchema.message}</Alert>}
        <div>{JSON.stringify(componentSchema.data)}</div>
        <div>{response?.template}</div>
      </form>
    </div>
  );
};
