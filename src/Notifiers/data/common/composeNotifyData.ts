import { INotifyData } from "../../INotifyData";
import { IConstantData } from "./IConstantData";

type ComposingNotifyData = (data: IConstantData) => (name: string, fields?: { [key: string]: any; }) => INotifyData;

export const composeNotifyData: ComposingNotifyData = ({ action, message, type }) => (name, fields) => ({
  action,
  component: {
    name,
    type,
  },
  fields,
  message,
});
