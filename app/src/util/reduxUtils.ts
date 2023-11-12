import { ActionCreatorWithPayload, Dispatch } from '@reduxjs/toolkit';

// A utility function that creates a dispatch handler based on the action creator passed to it
export function createDispatchHandler<ActionCreator extends ActionCreatorWithPayload<any, string>>(actionCreator: ActionCreator, dispatch: Dispatch) {
    return (value: Parameters<ActionCreator>[0]) => {console.log(value); dispatch(actionCreator(value))};
}

