// import logo from './logo.svg';
// import './App.css';
import BabylonMain from './components/babylon/BabylonMain';
import { MultiplayerProvider, reducerMultiplayer } from './context/MultiplayerContext';
import { CharacterProvider, reducerCharacter } from './context/CharacterContext';

const App = () => {
  const initialMultiplayer = {
    socket: null,
    me: {
      isSpectator: window.location.pathname === "/spec"
    },
    players: [],
  };
  const initialCharacter = {};
  return (
    <div className="App">
      <MultiplayerProvider initialState={initialMultiplayer} reducer={reducerMultiplayer}>
        <CharacterProvider initialState={initialCharacter} reducer={reducerCharacter}>
          <BabylonMain />
        </CharacterProvider >
      </MultiplayerProvider >
    </div>
  );
}

export default App;
