import { OpenAPI } from "openapi-types";

import type {
  OpenAPIMediaTypeObject,
  OpenAPIResponse,
  OpenAPISchemaObject,
} from "./types";

export function getSchemaFromComponents(
  doc: OpenAPI.Document,
  responseSchema: OpenAPIResponse,
): { error: string } | { data: OpenAPISchemaObject; message?: string } {
  if (!responseSchema) {
    return {
      error: "No schema provided, make sure to upload valid Open API schema",
    };
  }

  if (!("content" in responseSchema) || !responseSchema.content) {
    return {
      data: { type: "string", title: "Response" },
      message:
        "Can't get content of Response Object, response will be simple string",
    };
  }

  if (
    !("application/json" in responseSchema.content) ||
    !responseSchema.content["application/json"]
  ) {
    return {
      data: { type: "string", title: "Response" },
      message:
        "Can't json of Response Object content, response will be simple string",
    };
  }

  const contentJSON = responseSchema.content[
    "application/json"
  ] as OpenAPIMediaTypeObject;

  if (!contentJSON.schema) {
    return {
      error:
        "Can't get schema of Response Object, make sure to use 3 or higher version of Open API ",
    };
  }

  if ("$ref" in contentJSON.schema) {
    return getSchemaFromComponentsByRef(doc, contentJSON.schema["$ref"]);
  } else {
    return { data: contentJSON.schema };
  }
}

function getPathInObject(
  doc: object,
  path: string,
): doc is { [key: string]: object } {
  return path in doc;
}

export const getSchemaFromComponentsByRef = (
  doc: OpenAPI.Document,
  ref: string,
): { error: string } | { data: OpenAPISchemaObject; message?: string } => {
  const pathComponents = ref.split("/").filter(Boolean);

  let current: object = doc;
  let isComponentsPath = false;

  for (
    let componentIndex = 0;
    componentIndex < pathComponents.length;
    componentIndex++
  ) {
    const component = pathComponents[componentIndex];
    if (componentIndex == 0) {
      continue;
    }

    if (component == "components" && componentIndex === 1) {
      isComponentsPath = true;
    }

    if (getPathInObject(current, component)) {
      current = current[component];
    } else {
      return {
        error: `Path not found: ${ref}`,
      };
    }
  }

  if (!isComponentsPath) {
    return { error: `Given path is not path for components schema` };
  }

  return { data: current };
};
