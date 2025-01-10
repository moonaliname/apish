import { type OpenAPI } from "openapi-types";

import { type OpenAPIResponse } from "@shared/libs/openApi/types";
import { Accordion } from "@shared/ui/Accordion";
import { Badge } from "@shared/ui/Badge";
import { Text } from "@shared/ui/Text";

import { getMethodColor } from "../../libs/getMethodColor";
import { EndpointControl } from "./EndpointControl";
import { EndpointResponse } from "./EndpointResponse";

interface Props {
  doc: OpenAPI.Document;
  path: string;
  methods: Record<string, OpenAPI.Operation>;
}

export const Endpoint = ({ doc, path, methods }: Props) => {
  return (
    <>
      {Object.entries(methods).map(([method, methodSchema]) => {
        const value = `endpoint_${method}_${path}`;

        return (
          <Accordion.Item key={value} value={value}>
            <EndpointControl
              endpoint={{ path, method }}
              icon={
                <Badge classNames={{ root: getMethodColor(method) }}>
                  {method}
                </Badge>
              }
            >
              <Text className="block" truncate="end">
                {path}
              </Text>
            </EndpointControl>

            <Accordion.Panel>
              {methodSchema.responses &&
                Object.entries(methodSchema.responses).map(
                  ([response, responseSchema]: [string, OpenAPIResponse]) => {
                    return (
                      <EndpointResponse
                        key={`${path}_${method}_${response}`}
                        doc={doc}
                        path={path}
                        code={Number(response)}
                        responseSchema={responseSchema}
                        method={method}
                        scope={`${path}_${method}`}
                      />
                    );
                  },
                )}
            </Accordion.Panel>
          </Accordion.Item>
        );
      })}
    </>
  );
};
