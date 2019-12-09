import { INotifyObject } from "atomservicescore";
import { INotifyData } from "./INotifyData";

export class NotifyObject implements INotifyObject {
  public action: string;
  public component: { type: string; name: string; };
  public fields: { [field: string]: any; };
  public message: string;

  constructor(data: INotifyData) {
    this.action = data.action;
    this.component = {
      name: data.component.name,
      type: data.component.type,
    };

    if (data.fields) {
      this.fields = {
        ...data.fields,
      };
    }

    this.message = data.message;
  }
}
