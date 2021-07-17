import React from "react";
import "./App.css";
import Editor from "./Editor";
import { RecoilRoot } from "recoil";

function App() {
  return (
    <div className="App">
      <RecoilRoot>
        <Editor />
      </RecoilRoot>
    </div>
  );
}

export default App;
