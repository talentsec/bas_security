import React, { DragEvent, useCallback, useContext, useEffect, useRef, useState } from "react";
import {
  ReactFlow,
  Background,
  Controls,
  Node,
  Edge,
  useNodesState,
  useEdgesState,
  Connection,
  addEdge,
  DefaultEdgeOptions,
  ReactFlowInstance,
  MarkerType
} from "reactflow";
import "reactflow/dist/style.css";
import VectorNode from "./VectorNode";
import VectorEdge from "./VectorEdge";
import EndNode from "./EndNode";
import StartNode from "./StartNode";
import StartEdge from "./StartEdge";
import EndEdge from "./EndEdge";
import { CustomEdgeData, CustomNodeData, FlowContext } from ".";
import { isInChain, isLinked } from "./utils";

export type VectorNodeProps = {
  label: string;
  value: string;
};

export interface Flow {
  nodes: VectorNodeProps[];
}

const nodeTypes = {
  vector: VectorNode,
  start: StartNode,
  end: EndNode
};

const edgeTypes = {
  vector: VectorEdge,
  start: StartEdge,
  end: EndEdge
};

const edgeOptions: DefaultEdgeOptions = {
  animated: true,
  markerEnd: {
    type: MarkerType.ArrowClosed
  },
  data: {}
};

const VectorFlow = () => {
  const { data, flowInstance, setFlowInstance, onChange } = useContext(FlowContext);

  const reactFlowWrapper = useRef<HTMLDivElement | null>(null);
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  useEffect(() => {
    const initialNodes = data ? data.nodes : [];
    const initialEdges = data ? data.edges : [];
    setNodes(initialNodes);
    setEdges(initialEdges);
  }, [data]);

  useEffect(() => {
    if (flowInstance) {
      onChange && onChange("node", flowInstance.toObject());
    }
  }, [nodes]);

  useEffect(() => {
    if (flowInstance) {
      onChange && onChange("edge", flowInstance.toObject());
    }
  }, [edges]);

  const onConnect = useCallback(
    (params: Edge | Connection) => {
      const sourceNode = nodes.find(n => n.id === params.source);
      const targetNode = nodes.find(n => n.id === params.target);

      if (sourceNode && targetNode && params.source && params.target) {
        const newEdge: Edge<CustomEdgeData> = {
          id: `${params.source}-${params.target}`,
          source: params.source,
          target: params.target
        };
        const inChain = isInChain(sourceNode, targetNode, nodes, edges);
        if (inChain) {
          return;
        }

        if (sourceNode.type === "vector" && targetNode.type === "vector") {
          newEdge.type = "vector";
          newEdge.data = {};
          return setEdges(eds => addEdge(newEdge, eds));
        } else if (sourceNode.type === "start" && targetNode.type === "vector") {
          newEdge.type = "start";
          newEdge.data = {};
          return setEdges(eds => addEdge(newEdge, eds));
        } else if (sourceNode.type === "vector" && targetNode.type === "end") {
          newEdge.type = "end";
          newEdge.data = {};
          return setEdges(eds => addEdge(newEdge, eds));
        }
      }
    },
    [setEdges, nodes, edges]
  );

  const onInit = (_reactFlowInstance: ReactFlowInstance) => {
    setFlowInstance(_reactFlowInstance);
  };

  const onDragOver = useCallback((event: DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  const onDrop = useCallback(
    (event: DragEvent) => {
      event.preventDefault();
      const reactFlowBounds = reactFlowWrapper.current?.getBoundingClientRect();
      const dataStr = event.dataTransfer.getData("application/reactflow");
      const nodeData = JSON.parse(dataStr) as CustomNodeData;
      if (!nodeData || !reactFlowBounds || !flowInstance) {
        return;
      }

      const position = flowInstance.project({
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top
      });

      const sameNodeCount = nodes.filter(item => item.data.vectorId === nodeData.id).length;

      const newNode: Node = {
        id: nodeData.id + "-" + (sameNodeCount + 1),
        type: nodeData.type,
        position,
        data: {
          ...nodeData,
          id: nodeData.id + "-" + (sameNodeCount + 1),
          tag: sameNodeCount + 1,
          vectorId: nodeData.id,
          label: nodeData.label + "-" + (sameNodeCount + 1)
        }
      };

      setNodes(nds => [...nds, newNode]);
    },
    [flowInstance, nodes]
  );

  // const onEdgeClick = useCallback(
  //   (event: React.MouseEvent<Element, MouseEvent>, edge: Edge) => {
  //     edge.data.data.configured = true
  //     // const curIdx = edges.findIndex((e) => e.id === edge.id)
  //     // console.log('edge click', edge, curIdx)
  //   },
  //   [edges]
  // )

  return (
    <div className="w-full h-full p-2 border-[#E5E6EB] border-[1px] rounded" ref={reactFlowWrapper}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        defaultEdgeOptions={edgeOptions}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onInit={onInit}
        onDrop={onDrop}
        onDragOver={onDragOver}
        // onEdgeClick={onEdgeClick}
        fitView
      >
        <Controls showInteractive={true} />
        <Background />
      </ReactFlow>
    </div>
  );
};

export default VectorFlow;
