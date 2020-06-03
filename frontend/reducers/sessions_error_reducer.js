import { 
    RECEIVE_SESSION_ERRORS,
    RECEIVE_CURRENT_USER,
    CLEAR_SESSION_ERRORS
 } from '../actions/session_actions';

const _nullState = {
    errors: [],
}

export default (state = _nullState, action) => {
    Object.freeze(state);
    switch (action.type) {
        case RECEIVE_SESSION_ERRORS:
            return Object.assign({}, action.errors);
        case RECEIVE_CURRENT_USER:
            return _nullState;
        case CLEAR_SESSION_ERRORS:
            return _nullState;
        default:
            return state;
    }
}