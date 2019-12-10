export interface INotifyData {
  action: string;
  level: string;
  component: {
    type: string;
    name: string;
  };
  fields?: {
    [field: string]: any;
  };
  message: string;
  obj?: {
    [key: string]: any;
  };
}
