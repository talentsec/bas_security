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
          transform: `translate(100%, -50%)`
        }}
        onClick={() => {
          if (flowInstance && onConnectorClick) {
            const edges = flowInstance.getEdges();
            // const connectFrom = edges.findIndex((e) => e.source === id)
            const connectedEdges = edges.filter(e => e.source === id);
            // const isConnected = connectedEdges.length > 0 ? false : true
            console.log("cur node", data, connectedEdges);

            onConnectorClick(data, connectedEdges, flowInstance.toObject());
          }
        }}
        className="pointer-events-auto w-20 h-6 flex items-center justify-center z-50 cursor-pointer absolute rounded-sm text-white text-xs"
      >
        连接器配置
      </Handle>
    </>
  );
};

export default memo(VectorNode);
