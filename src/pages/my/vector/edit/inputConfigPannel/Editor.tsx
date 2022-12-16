import React from "react";
import { DndProvider } from "react-dnd";
import Example from "./example";
import { HTML5Backend } from "react-dnd-html5-backend";

interface PropsType {
  confirm: any;
  data: any;
  cancel: () => void;
}

export default function index({ confirm, data, cancel }: PropsType) {
  return (
    <div className="w-full h-full bg-gray-100">
      <DndProvider backend={HTML5Backend}>
        <Example confirm={confirm} data={data} cancel={cancel} />
      </DndProvider>
    </div>
  );
}
