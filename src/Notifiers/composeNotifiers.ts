import { INotifier } from "atomservicescore";
import { INotifiers } from "./INotifiers";
import { NotifyLog } from "./NotifyLog";
import { NotifyObject } from "./NotifyObject";

export const composeNotifiers = (...notifiers: INotifier[]): INotifiers => ((Notifiers): INotifiers => {
  const NOTIFIERS: INotifiers = {
    emit: (data) => {
      const log = new NotifyLog(data);
      const obj = new NotifyObject(data);

      Notifiers.forEach((notifier) => {
        if (notifier.log) {
          notifier.log(log);
        }

        if (notifier.on) {
          notifier.on(obj);
        }
      });
    },
  };

  Object.freeze(NOTIFIERS);

  return NOTIFIERS;
})(notifiers);
