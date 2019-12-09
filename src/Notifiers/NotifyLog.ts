import { INotifyLog } from "atomservicescore";
import { INotifyData } from "./INotifyData";

export class NotifyLog implements INotifyLog {
  public action: string;
  public component: { type: string; name: string; };
  public message: string;

  constructor(data: INotifyData) {
    this.action = data.action;
    this.component = {
      name: data.component.name,
      type: data.component.type,
    };
    this.message = data.message;
  }
}
