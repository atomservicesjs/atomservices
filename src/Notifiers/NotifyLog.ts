import { INotifyData, INotifyLog } from "atomservicescore";

export class NotifyLog implements INotifyLog {
  public readonly action: string;
  public readonly level: string;
  public readonly component: { type: string; name: string; };
  public readonly fields: { [field: string]: any; };
  public readonly message: string;

  constructor(data: INotifyData, error?: Error) {
    this.action = data.action;
    this.level = data.level;
    this.component = {
      name: data.component.name,
      type: data.component.type,
    };

    if (data.fields) {
      this.fields = {
        ...data.fields,
      };

      if (error) {
        this.fields.error = {
          message: error.message,
          name: error.name,
        };
      }
    }

    this.message = data.message
      .replace("$$ACTION$$", data.action)
      .replace("$$NAME$$", data.component.name)
      .replace("$$TYPE$$", data.component.type);
  }
}
