import { IIdentifier, IServiceIdentifier } from "atomservicescore";

export const ServiceIdentifierFactory = {
  create: (identifier: IIdentifier, type: string): IServiceIdentifier => ((Identifier, Type): IServiceIdentifier => {
    const ServiceIdentifier: IServiceIdentifier = {
      AggregateID: () => Identifier.AggregateID(Type),
      EventID: () => Identifier.EventID(Type),
      type: () => Type,
    };

    Object.freeze(ServiceIdentifier);

    return ServiceIdentifier;
  })(identifier, type),
};

Object.freeze(ServiceIdentifierFactory);
