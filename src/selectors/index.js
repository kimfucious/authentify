import { compact, get, first, map, some } from "lodash";
export const createLoadingSelector = (actions) => (state) => {
  return some(actions, (action) => get(state, `loading.${action}`));
  // return _(actions).some(action => _.get(state, `loading.${action}`));
};

export const getError = (actions, errors) => {
  // returns the first error messages for actions
  // * We assume when any request fails on a page that
  //   requires multiple API calls, we shows the first error
  return (
    first(compact(map(actions, (action) => get(errors, action)))) || ""
    // actions
    //   .map(action => _.get(state, `errors.${action}`))
    //   .compact()
    //   .first() || ""
  );
};

export const createUserMessageSelector = (actions) => (state) => {
  // returns the first error messages for actions
  // * We assume when any request fails on a page that
  //   requires multiple API calls, we shows the first error
  return (
    first(
      compact(map(actions, (action) => get(state, `messages.${action}`)))
    ) || ""
    // actions
    //   .map(action => _.get(state, `errors.${action}`))
    //   .compact()
    //   .first() || ""
  );
};
