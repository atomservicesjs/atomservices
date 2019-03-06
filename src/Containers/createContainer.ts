import { Containers, IContainer, IContainerConfigs, IService, Services } from "atomservicescore";

export const createContainer = (
  container: {
    name: string;
    services: Services.ServiceBootstrap[],
    configs?: IContainerConfigs;
  },
): Containers.ContainerBootstrap => (provider) =>
    (async (Name, ServiceBootstraps, ContextProvider, Configs): Promise<IContainer> => {
      const ServicesMap: { [name: string]: IService; } = {};
      const ps = ServiceBootstraps.map((bootstrap) => bootstrap(ContextProvider));
      const services = await Promise.all(ps);

      for (const service of services) {
        ServicesMap[service.name()] = service;
      }

      return {
        bootstrap: async (bootstraper) => {
          const service = await bootstraper(ContextProvider);

          ServicesMap[service.name()] = service;
        },
        configs: () => Configs,
        hash: () => Containers.ContainerHash.hash(Name),
        name: () => Name,
        service: (serviceName) => ServicesMap[serviceName],
        serviceNames: () => Object.keys(ServicesMap),
      };
    })(container.name, container.services, provider, container.configs = {});
