import { Edge, Node } from "reactflow";

export const isInChain = (sourceNode: Node, targetNode: Node, nodes: Node[], edges: Edge<any>[]) => {
  let res = false;
  const initNode = sourceNode;

  const test = (sourceNode: Node, targetNode: Node, nodes: Node[], edges: Edge<any>[]) => {
    const linkedEdge = edges.find(e => e.source === targetNode.id);
    if (linkedEdge) {
      const linkedNode = nodes.find(n => n.id === linkedEdge.target);
      if (linkedNode) {
        if (initNode.id === linkedNode.id) {
          res = true;
          return;
        }
        test(targetNode, linkedNode, nodes, edges);
      }
    }
  };
  test(sourceNode, targetNode, nodes, edges);
  return res;
};

export const isLinked = (sourceNode: Node, targetNode: Node, edges: Edge<any>[]) => {
  const idx = edges.findIndex(
    e =>
      (e.target === sourceNode?.id && e.source === targetNode?.id) ||
      (e.source === targetNode?.id && e.target === sourceNode?.id)
  );
  return idx === -1;
};
