import { type OpenAPI } from "openapi-types";

import { Accordion } from "@shared/ui/Accordion";
import { Badge } from "@shared/ui/Badge";
import { Text } from "@shared/ui/Text";

import { getMethodColor } from "../libs/getMethodColor";
import { EndpointControl } from "./EndpointControl";

interface Props {
  path: string;
  methods: Record<string, OpenAPI.Operation>;
}

export const Endpoint = ({ path, methods }: Props) => {
  return (
    <>
      {Object.entries(methods).map(([method, methodSchema]) => {
        const value = `endpoint_${method}_${path}`;

        return (
          <Accordion.Item key={value} value={value}>
            <EndpointControl
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
                  ([response, responseSchema]) => {
                    return <div>{response}</div>;
                  },
                )}
            </Accordion.Panel>
          </Accordion.Item>
        );
      })}
    </>
  );
};
