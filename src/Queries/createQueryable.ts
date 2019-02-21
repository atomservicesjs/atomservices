import { IQueryable, IQueryableResult } from "atomservicescore";
import { IQueryHandlers } from "./IQueryHandlers";

const QueryableResult = {
  error: (error: Error): IQueryableResult => ({
    error,
    status: "error",
    success: false,
  }),
  invalid: (invalidAttributes: any): IQueryableResult => ({
    invalidAttributes,
    status: "invalid",
    success: false,
  }),
  success: (result: any): IQueryableResult => ({
    result,
    status: "success",
    success: true,
  }),
  unhandled: (): IQueryableResult => ({
    status: "unhandled",
    success: false,
  }),
};

export const createQueryable = (handlers: IQueryHandlers): IQueryable => ({
  query: async (query) => {
    const handler = handlers.resolve(query);

    if (handler === undefined) {
      return QueryableResult.unhandled();
    } else {
      const validationResult = handler.validate(query.payloads);

      if (!validationResult.isValid) {
        const { invalidAttributes } = validationResult;

        return QueryableResult.invalid(invalidAttributes);
      } else {
        try {
          const result = await handler.query(query);

          return QueryableResult.success(result);
        } catch (error) {
          return QueryableResult.error(error);
        }
      }
    }
  },
});
