import { FC, memo, useContext, useEffect, useState } from "react";
import { EdgeProps, getSmoothStepPath, EdgeLabelRenderer } from "reactflow";
import { FlowContext } from ".";

const VectorEdge: FC<EdgeProps> = ({
  id,
  source,
  target,
  sourceX,
  sourceY,
  sourcePosition,
  targetPosition,
  targetX,
  targetY,
  data,
  markerEnd
}) => {
  const { data: flowData } = useContext(FlowContext);

  const [edgePath, labelX, labelY] = getSmoothStepPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetPosition,
    targetX,
    targetY
  });

  let color = "#e34d59";
  if (flowData) {
    const nodes = flowData.nodes;
    const sourceNode = nodes.find(n => n.id === source);
    if (sourceNode && !!sourceNode.data.connectorId) {
      color = "#48c79c";
    }
  }

  return (
    <>
      <path
        className="react-flow__edge-path"
        id={id}
        d={edgePath}
        markerEnd={markerEnd}
        style={{ stroke: color }}
      ></path>
    </>
  );
};

export default memo(VectorEdge);
