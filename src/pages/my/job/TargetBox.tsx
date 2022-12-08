import type { CSSProperties, FC } from "react";
import React, { memo, useCallback, useState } from "react";
import type { DropTargetMonitor } from "react-dnd";
import { useDrop } from "react-dnd";

import { Colors } from "./Colors";
import type { DragItem } from "./interfaces";

const style: CSSProperties = {
  border: "1px solid gray",
  height: "15rem",
  width: "15rem",
  padding: "2rem",
  textAlign: "center"
};

export interface TargetBoxProps {
  onDrop: (item: any) => void;
  lastDroppedColor?: string;
}

// eslint-disable-next-line react/prop-types
const TargetBox: FC<TargetBoxProps> = memo(function TargetBox({ onDrop, lastDroppedColor, children }) {
  const [{ isOver, draggingColor, canDrop }, drop] = useDrop(
    () => ({
      accept: [Colors.YELLOW, Colors.BLUE],
      drop(_item: DragItem, monitor) {
        onDrop(monitor.getItemType());
        return undefined;
      },
      collect: (monitor: DropTargetMonitor) => ({
        isOver: monitor.isOver(),
        canDrop: monitor.canDrop(),
        draggingColor: monitor.getItemType() as string
      })
    }),
    [onDrop]
  );

  const opacity = isOver ? 1 : 0.7;
  let backgroundColor = "#fff";
  switch (draggingColor) {
    case Colors.BLUE:
      backgroundColor = "lightblue";
      break;
    case Colors.YELLOW:
      backgroundColor = "lightgoldenrodyellow";
      break;
    default:
      break;
  }

  return (
    <div
      ref={drop}
      data-color={lastDroppedColor || "none"}
      style={{ ...style, backgroundColor, opacity }}
      role="TargetBox"
    >
      <p>Drop here.</p>
      {children}
      {!canDrop && lastDroppedColor && <p>Last dropped: {lastDroppedColor}</p>}
    </div>
  );
});

export interface StatefulTargetBoxState {
  lastDroppedColor: string | null;
}
export const StatefulTargetBox: FC = props => {
  const [lastDroppedColor, setLastDroppedColor] = useState<string | null>(null);
  const [list, setList] = useState<string[]>([]);
  const handleDrop = (color: string) => {
    console.log(list, 444);
    setList([...list, color]);
    setLastDroppedColor(color);
  };

  console.log(handleDrop, lastDroppedColor, list, 22222);
  return <TargetBox {...props} lastDroppedColor={lastDroppedColor as string} onDrop={handleDrop}></TargetBox>;
};
