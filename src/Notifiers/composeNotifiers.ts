import { INotifier } from "atomservicescore";
import { INotifiers } from "./INotifiers";
import { NotifyLog } from "./NotifyLog";
import { NotifyObject } from "./NotifyObject";

export const composeNotifiers = (...notifiers: INotifier[]): INotifiers => ((Notifiers): INotifiers => {
  const NOTIFIERS: INotifiers = {
    emit: (data) => {
      Notifiers.forEach((notifier) => {
        if (notifier.log) {
          const log = new NotifyLog(data);
          notifier.log(log);
        }

        if (notifier.on) {
          const obj = new NotifyObject(data);
          notifier.on(obj);
        }
      });
    },
  };

  Object.freeze(NOTIFIERS);

  return NOTIFIERS;
})(notifiers);
