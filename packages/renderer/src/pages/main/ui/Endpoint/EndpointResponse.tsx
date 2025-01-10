import { type OpenAPIResponse, getSchemaFromResponse } from "@apish/common";
import cn from "clsx";
import { type OpenAPI } from "openapi-types";
import { useRef } from "react";

import { Alert } from "@shared/ui/Alert";

import { useResponseQuery } from "../../api/useResponseQuery";
import { useUpdateResponse } from "../../api/useUpdateResponse";
import { FieldConductor } from "./FieldConductor";

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

  const { data: componentSchema, error: componentSchemaError } =
    getSchemaFromResponse(doc, responseSchema);

  if (!componentSchema) {
    return <Alert>{componentSchemaError}</Alert>;
  }

  return (
    <div className={cn("flex", "flex-col", "gap-1")}>
      <form ref={formRef} onChange={handleChange}>
        {componentSchema.type === "object" && (
          <FieldConductor
            doc={doc}
            schema={componentSchema}
            field=""
            template={
              response?.template
                ? JSON.parse(response?.template)
                : {
                    id: 123,
                    name: "Alina",
                    content_type: "Podcast",
                    alternative_names: ["123", "456"],
                  }
            }
            title=""
          />
        )}
      </form>

      {componentSchemaError && <Alert>{componentSchemaError}</Alert>}
    </div>
  );
};
