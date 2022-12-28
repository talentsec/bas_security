import { FC, memo } from "react";
import { EdgeProps, getSmoothStepPath, EdgeLabelRenderer } from "reactflow";

export type StartEdgeProps = EdgeProps & {
  onClick: () => void;
};

const StartEdge: FC<EdgeProps> = ({
  id,
  sourceX,
  sourceY,
  sourcePosition,
  targetPosition,
  targetX,
  targetY,
  markerEnd
}) => {
  const [edgePath, labelX, labelY] = getSmoothStepPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetPosition,
    targetX,
    targetY
  });

  return (
    <>
      <path className="react-flow__edge-path" id={id} d={edgePath} markerEnd={markerEnd}>
        <EdgeLabelRenderer>
          <div
            style={{
              transform: `translate(-50%, -50%) translate(${labelX}px, ${labelY}px)`
            }}
            className={`pointer-events-auto cursor-pointer absolute rounded-sm  text-white p-1 text-xs nopan nodrag`}
          >
            开始
          </div>
        </EdgeLabelRenderer>
      </path>
    </>
  );
};

export default memo(StartEdge);
