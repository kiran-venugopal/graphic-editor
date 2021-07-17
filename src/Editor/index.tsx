import React from "react";
import Playground from "./Playground";
import Sidebar from "./Sidebar";
import "./editor.css";

function Editor() {
  return (
    <div className="editor">
      <Playground />
      <Sidebar />
    </div>
  );
}

export default Editor;
