export interface INotifyData {
  action: string;
  component: {
    type: string;
    name: string;
  };
  fields: {
    [field: string]: any;
  };
  message: string;
}
