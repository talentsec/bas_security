import { FC, memo, useContext } from "react";
import { Handle, Position } from "reactflow";
import { CustomNodeData, FlowContext } from ".";
import add from "../../assets/add.svg";

interface IProps {
  id: string;
  data: CustomNodeData;
  isConnectable: boolean;
}

const VectorNode: FC<IProps> = ({ id, data, isConnectable }) => {
  const { onConnectorClick, flowInstance } = useContext(FlowContext);
  const color = data.connectorId ? "#48c79c" : "#e34d59";

  return (
    <>
      <Handle
        type="target"
        position={Position.Left}
        className="w-4 h-4 bg-transparent rounded-full -translate-x-3 -translate-y-2 bg-cover bg-no-repeat"
        style={{ backgroundImage: `url(${add})`, fontSize: "10px" }}
      />
      <div className="w-24 h-10 z-0 border border-[#c9cdd4] rounded flex justify-center items-center">
        <span title={data.label} className="p-2 text-xs truncate">
          {data.label}
        </span>
      </div>
      <Handle
        type="source"
        position={Position.Right}
        style={{
          backgroundColor: color,
          width: "5rem",
          height: "1.5rem",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          color: "#ffffff",
          borderRadius: "4px",
          fontSize: ".75rem",
          transform: `translate(100%, -50%)`
        }}
        onClick={() => {
          if (flowInstance && onConnectorClick) {
            const edges = flowInstance.getEdges();
            const connectedEdges = edges.filter(e => e.source === id);
            onConnectorClick(data, connectedEdges, flowInstance.toObject());
          }
        }}
      >
        连接器配置
      </Handle>
    </>
  );
};

export default memo(VectorNode);
