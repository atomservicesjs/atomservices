import { IQuery, IQueryHandler, IServiceContext, Services, StateQueryStreamListener } from "atomservicescore";
import { IQueryHandlers } from "../../Queries/IQueryHandlers";
import { signQuery } from "../../Queries/signQuery";
import { QueryResult } from "../QueryResult";
import { StateQueryResult } from "./StateQueryResult";

const querying = async (handler: IQueryHandler, query: IQuery, context: IServiceContext, ref: any) => {
  const qr = StateQueryResult({
    action: "query",
    name: query.name,
    ref,
    scope: context.scope(),
    type: context.type(),
  });

  try {
    const result = await handler.query(query);

    context.toRef(ref, qr.success(result));
  } catch (error) {
    return context.toRef(ref, qr.error(error));
  }
};

export const createQuerier = (queryHandlers: IQueryHandlers, context: IServiceContext) =>
  (query: IQuery, listener: StateQueryStreamListener): Services.QueryResultType => {
    const type = queryHandlers.type();
    const handler = queryHandlers.resolve(query);

    if (handler === undefined) {
      const { name } = query;

      return QueryResult.unhandled(type, name);
    } else {
      const validationResult = handler.validate(query.payloads);

      if (!validationResult.isValid) {
        const { invalidAttributes } = validationResult;

        return QueryResult.invalid(invalidAttributes);
      } else {
        const scope = context.scope();
        const ref = signQuery.sign(query, type, scope);
        context.fromRef(ref, listener);
        querying(handler, query, context, ref);

        return QueryResult.accept(ref);
      }
    }
  };

Object.freeze(createQuerier);
