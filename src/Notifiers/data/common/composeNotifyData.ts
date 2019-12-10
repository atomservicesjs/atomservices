import { INotifyData } from "../../INotifyData";
import { IConstantData } from "./IConstantData";

type ComposingNotifyData = (data: IConstantData) => (
  name: string,
  fields?: { [field: string]: any; },
  obj?: { [key: string]: any; },
) => INotifyData;

export const composeNotifyData: ComposingNotifyData = ({ action, level, message, type }) => (name, fields, obj) => ({
  action,
  component: {
    name,
    type,
  },
  fields,
  level,
  message,
  obj,
});
