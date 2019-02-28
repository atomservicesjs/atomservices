import { ICommandHandlers } from "../Commands/ICommandHandlers";
import { IEventHandlers } from "../Events/IEventHandlers";
import { IStateRepository } from "../IStateRepository";
import { IQueryHandlers } from "../Queries/IQueryHandlers";
import { IReactions } from "../Reactions/IReactions";

import { combineCommandHandlers } from "../Commands/combineCommandHandlers";
import { combineEventHandlers } from "../Events/combineEventHandlers";
import { combineQueryHandlers } from "../Queries/combineQueryHandlers";
import { combineReactions } from "../Reactions/combineReactions";

const createEmptyRepository = (): IStateRepository => ({
  applyEvent: async () => {
    throw new Error("Calling EmptyRepository.applyEvent()");
  },
  queryByID: async () => {
    throw new Error("Calling EmptyRepository.queryByID()");
  },
});

export const composeServiceComponents = (
  components: {
    composeCommandHandlers?: (type: string) => ICommandHandlers;
    composeEventHandlers?: (type: string) => IEventHandlers;
    composeQueryHandlers?: (type: string) => IQueryHandlers;
    composeReactions?: (type: string) => IReactions;
    repository?: IStateRepository;
  },
): {
  composeCommandHandlers: (type: string) => ICommandHandlers;
  composeEventHandlers: (type: string) => IEventHandlers;
  composeQueryHandlers: (type: string) => IQueryHandlers;
  composeReactions: (type: string) => IReactions;
  repository: IStateRepository;
} => ({
  composeCommandHandlers: components.composeCommandHandlers || combineCommandHandlers(),
  composeEventHandlers: components.composeEventHandlers || combineEventHandlers(),
  composeQueryHandlers: components.composeQueryHandlers || combineQueryHandlers(),
  composeReactions: components.composeReactions || combineReactions(),
  repository: components.repository || createEmptyRepository(),
});
