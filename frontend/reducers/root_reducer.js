import errorsReducer from './errors_reducer';
import sessionsReducer from './sessions_reducer';
import entitiesReducer from './entities_reducer';
import loading from './loading_reducer'
import {combineReducers} from 'redux';

export default combineReducers({
    entities: entitiesReducer,
    session: sessionsReducer,
    errors: errorsReducer,
    loading,
})