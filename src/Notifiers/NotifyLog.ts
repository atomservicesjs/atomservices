import { INotifyLog } from "atomservicescore";
import { INotifyData } from "./INotifyData";

export class NotifyLog implements INotifyLog {
  public readonly action: string;
  public readonly component: { type: string; name: string; };
  public readonly fields: { [field: string]: any; };
  public readonly message: string;

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

    this.message = data.message
      .replace("$$ACTION$$", data.action)
      .replace("$$NAME$$", data.component.name)
      .replace("$$TYPE$$", data.component.type);
  }
}
