import { IPrimitiveField, ITemplate } from "@apish/common";

export const updateTemplate = (
  template: ITemplate,
  path: string,
  value: IPrimitiveField,
): ITemplate => {
  const deepCopyAndUpdate = (obj: ITemplate, valuePath: string): ITemplate => {
    if (valuePath === path) {
      return value;
    }

    if (Array.isArray(obj)) {
      return obj.map((item, index) => {
        return deepCopyAndUpdate(item, `${valuePath}[${String(index)}]`);
      });
    } else if (obj && typeof obj === "object") {
      return Object.keys(obj).reduce((copy, key) => {
        copy[key] = deepCopyAndUpdate(
          obj[key],
          valuePath ? `${valuePath}.${key}` : key,
        );
        return copy;
      }, {} as ITemplate);
    } else {
      return obj;
    }
  };

  return deepCopyAndUpdate(template, "");
};
