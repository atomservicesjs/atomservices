import { Containers, IContainer, IContainerConfigs, IService, Services } from "atomservicescore";
import { DuplicatedServiceHashException } from "../Exceptions/Core";

export const createContainer = (
  container: {
    name: string;
    services: Services.ServiceBootstrap[],
    configs?: IContainerConfigs;
  },
): Containers.ContainerBootstrap => (provider) =>
    (async (ContainerName, ServiceBootstraps, ContextProvider, Configs): Promise<IContainer> => {
      const ServicesMap: { [hash: string]: IService; } = {};
      const ServicesHashMap: { [name: string]: string; } = {};

      const ps = ServiceBootstraps.map((bootstrap) => bootstrap(ContextProvider));
      const services = await Promise.all(ps);

      for (const service of services) {
        const ServiceName = service.name();
        const servicename = ServiceName.toLowerCase();

        if (ServicesHashMap[servicename] === undefined) {
          const servicehash = service.hash(ContainerName);
          ServicesHashMap[servicename] = servicehash;
          ServicesMap[servicehash] = service;
        } else {
          throw DuplicatedServiceHashException(ContainerName, ServiceName);
        }
      }

      const ContainerHash = Containers.ContainerHash.hash(ContainerName);

      return {
        bootstrap: async (bootstraper) => {
          const service = await bootstraper(ContextProvider);

          ServicesMap[service.name()] = service;
        },
        configs: () => Configs,
        hash: () => ContainerHash,
        name: () => ContainerName,
        service: (serviceName) => {
          const servicename = serviceName.toLowerCase();
          const servicehash = ServicesHashMap[servicename];

          return ServicesMap[servicehash];
        },
        serviceNames: () => {
          const ServiceInstances = Object.values(ServicesMap);

          return ServiceInstances.map((each) => each.name());
        },
      };
    })(container.name, container.services, provider, container.configs = {});
