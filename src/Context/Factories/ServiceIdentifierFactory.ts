import { IIdentifier, Service } from "atomservicescore";

export const ServiceIdentifierFactory = {
  create: (
    identifier: IIdentifier,
    type: string,
  ): Service.IServiceIdentifier => ((Identifier, Type): Service.IServiceIdentifier => {
    const ServiceIdentifier: Service.IServiceIdentifier = {
      AggregateID: () => Identifier.AggregateID(Type),
      EventID: () => Identifier.EventID(Type),
      type: () => Type,
    };

    Object.freeze(ServiceIdentifier);

    return ServiceIdentifier;
  })(identifier, type),
};

Object.freeze(ServiceIdentifierFactory);
