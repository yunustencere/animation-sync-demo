import React, { createContext, useContext, useReducer } from "react";

export const MultiplayerContext = createContext();

var initialStateHolder;
export const MultiplayerProvider = ({ reducer, initialState, children }) => {
  initialStateHolder = initialState
  return (
    <MultiplayerContext.Provider value={useReducer(reducer, initialState)}>{children}</MultiplayerContext.Provider>
  );
}

export const useMultiplayerValue = () => useContext(MultiplayerContext);

export const reducerMultiplayer = (state, action) => {
  let list;
  switch (action.type) {
    case "updateSocket":
      return {
        ...state,
        socket: { ...action.socket },
      };
    case "setMe":
      return {
        ...state,
        me: { ...state.me, ...action.me }
      };
    case "setPlayers":
      return {
        ...state,
        players: [...action.players],
      };
    case "newPlayer":
      return {
        ...state,
        players: [...state.players, action.player],
      };
    case "playerLeft":
      list = state.players.filter((item) => item.socketId !== action.socketId);
      return { ...state, players: list };

    default:
      return state;
  }
};
