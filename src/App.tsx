import { useState } from "react";
import Login from "./pages/Login";
import Public from "./pages/Public";

function App() {
  const [hasLoggedIn, setHasLoggedIn] = useState<boolean>(false)

  return (
    <>
    {
      hasLoggedIn ? 
      <Public />
      :
      <Login setHasLoggedIn={setHasLoggedIn} />
    }
    </>
  );
}

export default App;
