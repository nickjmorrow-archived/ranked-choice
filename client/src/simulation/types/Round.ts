import { OptionResult } from '~/polling/types/OptionResult';

export interface Round {
    roundId: number;
    optionVoteResults: OptionResult[];
}
