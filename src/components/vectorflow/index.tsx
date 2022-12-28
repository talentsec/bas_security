import { createContext, FC, useState } from "react";
import { ReactFlowInstance, ReactFlowProvider } from "reactflow";
import FlowPanel from "./FlowPanel";
import NodePanel from "./NodePanel";
import "./index.css";

export type CustomType = "vector" | "end" | "start";

export type CustomNodeData = {
  id: string;
  label: string;
  type: CustomType;
};

export type CustomEdgeData = {
  configured?: boolean;
};

export type FlowData = {
  nodes: {
    id: string;
    type?: string;
    position: { x: number; y: number };
    data: CustomNodeData;
  }[];
  edges: {
    id: string;
    source: string;
    target: string;
    type?: string;
    animated?: boolean;
    // configured?: boolean
    data?: CustomEdgeData;
  }[];
  viewport?: { x: number; y: number; zoom: number };
};

export interface IProps {
  data?: FlowData;
  simple?: boolean;
  presetNodes: CustomNodeData[];
  onChange?: (type: "node" | "edge", data: any) => void;
  onEdgeClick?: (
    edgeProps: {
      target: string;
      source: string;
      id: string;
    },
    flowData: FlowData
  ) => void;
  onClear?: () => void; // 清空
  onSave?: (success: boolean, data?: FlowData, error?: string) => void;
}

interface StateProps extends IProps {
  flowInstance: ReactFlowInstance | null;
  setFlowInstance: (e: ReactFlowInstance) => void;
}

export const FlowContext = createContext({} as StateProps);

const VectorFlow: FC<IProps> = ({ presetNodes, onChange, onEdgeClick, onClear, onSave, simple, data }) => {
  const [flowInstance, setFlowInstance] = useState<ReactFlowInstance | null>(null);

  return (
    <FlowContext.Provider
      value={{
        simple,
        flowInstance,
        setFlowInstance,
        presetNodes,
        onChange,
        onEdgeClick,
        onClear,
        onSave,
        data
      }}
    >
      <ReactFlowProvider>
        <div className="w-full h-full flex justify-between">
          {!simple && (
            <div className="w-3/12">
              <NodePanel />
            </div>
          )}

          <div className={simple ? "w-full" : "w-9/12"}>
            <FlowPanel />
          </div>
        </div>
      </ReactFlowProvider>
    </FlowContext.Provider>
  );
};

export default VectorFlow;
