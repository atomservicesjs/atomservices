import { INotifyData } from "./INotifyData";

export interface INotifiers {
  emit: (data: INotifyData) => void;
}
