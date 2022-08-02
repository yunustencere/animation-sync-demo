import React, { createContext, useContext, useReducer } from "react";

export const CharacterContext = createContext();

var initialStateHolder;
export const CharacterProvider = ({ reducer, initialState, children }) => {
  initialStateHolder = initialState
  return (
    <CharacterContext.Provider value={useReducer(reducer, initialState)}>{children}</CharacterContext.Provider>
  );
}

export const useCharacterValue = () => useContext(CharacterContext);

export const reducerCharacter = (state, action) => {

  switch (action.type) {
    case "updateCharacter":
      return {
        ...state,
        ...action.character,
      };
  
    default:
      return state;
  }
};
