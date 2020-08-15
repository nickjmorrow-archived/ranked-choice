import axios from 'axios';
import { call, put, takeEvery } from 'redux-saga/effects';
import { handleError } from '~/core';
import { pollVotingActions, PollVotingActionTypeKeys } from '~/poll-voting/state/pollVotingActions';
import { push } from 'connected-react-router';

const apiRoutes = {
    getPoll: {
        route: (link: string) => `/polls/${link}`,
        method: axios.get,
    },
    voteOnPoll: {
        route: '/polls/vote',
        method: axios.post,
    },
};

function* getPollAsync(action: ReturnType<typeof pollVotingActions.getPoll.request>) {
    try {
        const { data } = yield call(apiRoutes.getPoll.method, apiRoutes.getPoll.route(action.payload));
        yield put(pollVotingActions.getPoll.success(data));
    } catch (error) {
        handleError(error);
        yield put(pollVotingActions.getPoll.failure(error));
    }
}

function* watchGetPollAsync() {
    yield takeEvery(PollVotingActionTypeKeys.GET_POLL, getPollAsync);
}

function* voteOnPollAsync(action: ReturnType<typeof pollVotingActions.voteOnPoll.request>) {
    try {
        yield call(apiRoutes.voteOnPoll.method, apiRoutes.voteOnPoll.route, action.payload);
        yield push('/voting-success');
    } catch (error) {
        handleError(error);
        yield put(pollVotingActions.voteOnPoll.failure(error));
    }
}

function* watchVoteOnPollAsync() {
    yield takeEvery(PollVotingActionTypeKeys.VOTE_ON_POLL, voteOnPollAsync);
}

export const pollVotingSagas = [watchGetPollAsync, watchVoteOnPollAsync];
