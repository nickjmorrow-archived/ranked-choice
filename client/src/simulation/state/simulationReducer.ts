import { ActionType } from 'typesafe-actions';
import { produce } from 'immer';
import { SimulationState } from '~/simulation/types/SimulationState';
import { simulationInitialState } from '~/simulation/state/simulationInitialState';
import { simulationActions, SimulationActionTypeKeys } from '~/simulation/state/simulationActions';

export const simulationReducer = (
    state: SimulationState = simulationInitialState,
    action: ActionType<typeof simulationActions>,
): SimulationState => {
    switch (action.type) {
        case SimulationActionTypeKeys.ADD_VOTE:
            return produce(state, draftState => {
                const voterId = state.votes.reduce((agg, cur) => Math.max(agg, cur.voterId), 0) + 1;
                draftState.votes.push({ voterId, choices: action.payload.choices });
            });
        case SimulationActionTypeKeys.ADD_OPTION:
            return produce(state, draftState => {
                const optionId = state.options.reduce((agg, cur) => Math.max(agg, cur.optionId), 0) + 1;
                draftState.options.push({ optionId, label: action.payload.label });
            });
        case SimulationActionTypeKeys.ADD_CHOICE:
            return produce(state, draftState => {
                const vote = draftState.votes.find(v => v.voterId === action.payload.vote.voterId)!;
                vote.choices = [
                    ...vote.choices
                        .sort((a, b) => (a.orderId < b.orderId ? -1 : 1))
                        .map((c, i) => ({ ...c, orderId: i + 1 })),
                    { optionId: action.payload.optionId, orderId: vote.choices.length + 1 },
                ];
            });
        case SimulationActionTypeKeys.REMOVE_CHOICE:
            return produce(state, draftState => {
                const { choices } = draftState.votes.find(v => v.voterId === action.payload.vote.voterId)!;
                choices.splice(
                    choices.findIndex(c => c.optionId === action.payload.choice.optionId),
                    1,
                );
                choices
                    .sort((a, b) => (a.orderId < b.orderId ? -1 : 1))
                    .forEach((c, i) => {
                        c.orderId = i + 1;
                    });
            });
        default:
            return state;
    }
};
