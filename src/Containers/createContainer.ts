import { Containers, IContainer, IContainerConfigs, IService, Services } from "atomservicescore";
import { DuplicatedServiceHashException } from "../Exceptions/Core";

export const createContainer = (
  container: {
    name: string;
    services: Services.ServiceBootstrap[],
    configs?: IContainerConfigs;
  },
): Containers.ContainerBootstrap => (ContextProvider) =>
    (async (ContainerName, ServiceBootstraps, Configs): Promise<IContainer> => {
      const ServicesMap: { [hash: string]: IService; } = {};
      const ServicesHashMap: { [name: string]: string; } = {};

      const bootstrapings = ServiceBootstraps.map((bootstrap) => bootstrap(ContextProvider));
      const services = await Promise.all(bootstrapings);

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

      const ServiceSelector = (type: string) => {
        const servicename = type.toLowerCase();
        const servicehash = ServicesHashMap[servicename];

        return ServicesMap[servicehash];
      };

      return {
        bootstrap: async (bootstraper) => {
          const service = await bootstraper(ContextProvider);

          ServicesMap[service.name()] = service;
        },
        configs: () => Configs,
        dispatch: (type, command, listener) => {
          const Service = ServiceSelector(type);

          return Service.dispatch(command, listener);
        },
        hash: () => ContainerHash,
        name: () => ContainerName,
        query: (type, query, listener) => {
          const Service = ServiceSelector(type);

          return Service.query(query, listener);
        },
        service: (type) => ServiceSelector(type),
        serviceNames: () => {
          const ServiceInstances = Object.values(ServicesMap);

          return ServiceInstances.map((each) => each.name());
        },
      };
    })(container.name, container.services, container.configs = {});
