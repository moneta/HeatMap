import { combineReducers } from 'redux';

import income from './domain/income';
import heat from './ui/heat';

export default combineReducers({
  heat,
  income,
});
