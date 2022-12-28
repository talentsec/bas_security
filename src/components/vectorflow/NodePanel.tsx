import { DragEvent, FC, useContext } from "react";
import { Edge, Node } from "reactflow";
import { CustomNodeData, FlowContext } from ".";

const NodeItem: FC<{
  item: CustomNodeData;
}> = ({ item }) => {
  const onDragStart = (event: DragEvent, node: any) => {
    event.dataTransfer.setData("application/reactflow", node);
    event.dataTransfer.effectAllowed = "move";
  };

  return (
    <div
      title={item.label}
      className="cursor-pointer flex justify-center items-center w-36 h-12 mb-4 border-dashed border-[1px] border-[#e5e6eb] bg-[#f2f3f5] rounded"
      onDragStart={event => {
        onDragStart(event, JSON.stringify(item));
      }}
      draggable
    >
      <span title={item.label} className="p-2 truncate">
        {item.label}
      </span>
    </div>
  );
};

const checkFlowData = (
  nodes: Node[],
  edges: Edge<any>[]
): {
  success: boolean;
  error?: string;
} => {
  const startNode = nodes.find(n => n.type === "start");
  const endNode = nodes.find(n => n.type === "end");
  if (!(startNode && endNode)) {
    return {
      success: false,
      error: "缺少开始和结束节点！"
    };
  } else if (!(edges.find(e => e.source === startNode.id) && edges.find(e => e.target === endNode.id))) {
    return {
      success: false,
      error: "没有连接开始和结束节点！"
    };
  } else {
    return {
      success: true
    };
  }
};

const VectorPannel = () => {
  const { presetNodes, flowInstance, onSave, onClear } = useContext(FlowContext);

  return (
    <div className="w-full h-full p-4 ">
      <div className="h-full flex flex-col justify-between items-center">
        <div className="w-full h-[calc(100%-4rem)] overflow-y-auto flex flex-col">
          <div className="w-full border-0 border-b border-dashed border-gray-300 flex flex-col justify-between items-center">
            <NodeItem item={{ id: "start-node", label: "开始", type: "start" }} />
            <NodeItem item={{ id: "end-node", label: "结束", type: "end" }} />
          </div>
          <div className="pt-4">
            {presetNodes.map((item, idx) => {
              return (
                <div key={idx} className="h-20 flex justify-center items-center">
                  <NodeItem item={item} />
                </div>
              );
            })}
          </div>
        </div>

        <div className="w-full border-0 border-t border-dashed border-gray-300 h-16 flex flex-wrap justify-center items-center">
          <span
            className="p-2 cursor-pointer"
            onClick={() => {
              const nodes = flowInstance?.getNodes();
              const edges = flowInstance?.getEdges();
              flowInstance?.deleteElements({ nodes, edges });
              onClear && onClear();
            }}
          >
            清空
          </span>
          <span
            className="p-2 cursor-pointer"
            onClick={() => {
              if (flowInstance && onSave) {
                const res = checkFlowData(flowInstance.getNodes(), flowInstance.getEdges());
                onSave(res.success, flowInstance.toObject(), res.error);
              }
            }}
          >
            保存
          </span>
        </div>
      </div>
    </div>
  );
};

export default VectorPannel;
