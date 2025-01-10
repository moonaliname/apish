import type { ITemplate, OpenAPISchemaObject } from "@apish/common";
import type { OpenAPI } from "openapi-types";

import { getSchemaType } from "../../../libs/getSchemaType";
import { isDate } from "../../../libs/isDate";
import { AnyOfField } from "./AnyOfField";
import { ArrayField } from "./ArrayField";
import { BooleanField } from "./BooleanField";
import { DateField } from "./DateField";
import { NumberField } from "./NumberField";
import { ObjectField } from "./ObjectField";
import { OneOfField } from "./OneOfField";
import { SelectField } from "./SelectField";
import { TextField } from "./TextField";

interface FieldConductorProps {
  doc: OpenAPI.Document;
  schema: OpenAPISchemaObject;
  field: string;
  title: string;
  template: ITemplate;
}

export const FieldConductor = (props: FieldConductorProps) => {
  const type = getSchemaType(props.schema);
  const isDateField = isDate(props.schema);
  const isEnum = !!props.schema.enum;

  return (
    <>
      {type === "object" && (
        <ObjectField {...props} FieldConductor={FieldConductor} />
      )}

      {type === "array" && (
        <ArrayField FieldConductor={FieldConductor} {...props} />
      )}

      {type === "string" && !isDateField && !isEnum && <TextField {...props} />}

      {type === "string" && isDateField && !isEnum && <DateField {...props} />}

      {type === "number" || (type === "integer" && <NumberField {...props} />)}

      {type === "boolean" && <BooleanField {...props} />}

      {isEnum && <SelectField {...props} />}

      {!!props.schema.anyOf && (
        <AnyOfField {...props} FieldConductor={FieldConductor} />
      )}

      {!!props.schema.oneOf && (
        <OneOfField {...props} FieldConductor={FieldConductor} />
      )}
    </>
  );
};
