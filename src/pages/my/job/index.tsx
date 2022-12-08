import React from "react";
import { DndProvider } from "react-dnd";
import Example from "./example";
import { HTML5Backend } from "react-dnd-html5-backend";

export default function index() {
  return (
    <div className="w-full h-full">
      <DndProvider backend={HTML5Backend}>
        <Example />
      </DndProvider>
    </div>
  );
}
