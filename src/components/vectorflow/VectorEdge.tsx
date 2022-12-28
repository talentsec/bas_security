import { FC, memo, useContext } from "react";
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
  const { onEdgeClick, flowInstance } = useContext(FlowContext);
  const [edgePath, labelX, labelY] = getSmoothStepPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetPosition,
    targetX,
    targetY
  });

  const color = data.configured ? "#48c79c" : "#e34d59";

  return (
    <>
      <path className="react-flow__edge-path" id={id} d={edgePath} markerEnd={markerEnd} style={{ stroke: color }}>
        <EdgeLabelRenderer>
          <div
            style={{
              backgroundColor: color,
              transform: `translate(-50%, -50%) translate(${labelX}px, ${labelY}px)`
            }}
            className="select-none pointer-events-auto z-50 cursor-pointer absolute rounded-sm text-white p-1 text-xs nopan nodrag"
            onClick={() => {
              onEdgeClick && flowInstance && onEdgeClick({ id, source, target }, flowInstance.toObject());
            }}
          >
            连接器配置
          </div>
        </EdgeLabelRenderer>
      </path>
    </>
  );
};

export default memo(VectorEdge);
