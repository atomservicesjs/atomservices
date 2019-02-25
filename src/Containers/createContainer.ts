import { IContainer, IContainerConfigs, IContextProvider, IService } from "atomservicescore";

export const createContainer = (
  containerName: string,
  containerConfigs: IContainerConfigs,
  contextProvider: IContextProvider,
): IContainer => ((ContainerName, ContainerConfigs, ContextProvider): IContainer => {
  const ServicesMap: { [name: string]: IService; } = {};

  return {
    configs: () => ContainerConfigs,
    name: () => ContainerName,
    provide: (type, configs) => ContextProvider.provide(type, configs),
    registerService: (service) => ServicesMap[service.name()] = service,
    service: (serviceName) => ServicesMap[serviceName],
    serviceNames: () => Object.keys(ServicesMap),
    services: () => Object.values(ServicesMap),
  };
})(containerName, containerConfigs, contextProvider);
