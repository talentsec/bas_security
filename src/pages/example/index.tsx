import { useState } from "react";
import VectorFlow, { CustomNodeData, FlowData } from "../../components/vectorflow";

const CustomNodeList: CustomNodeData[] = [
  {
    id: "111",
    label: "向量1",
    type: "vector"
  },
  {
    id: "121",
    label: "向量2",
    type: "vector"
  },
  {
    id: "131",
    label: "文字长度测试很长的换行省略号的向量",
    type: "vector"
  },
  {
    id: "141",
    label: "向量4",
    type: "vector"
  },
  {
    id: "141",
    label: "向量4",
    type: "vector"
  },
  {
    id: "141",
    label: "向量4",
    type: "vector"
  }
];

function App() {
  const [initialValues, setInitialValues] = useState<FlowData | undefined>({
    nodes: [
      {
        id: "121",
        type: "vector",
        position: { x: 704.4375, y: 485 },
        data: { id: "121", label: "向量2", type: "vector" }
      },
      {
        id: "111",
        type: "vector",
        position: { x: 575.15625, y: 419.5 },
        data: { id: "111", label: "向量1", type: "vector" }
      }
    ],
    edges: [
      {
        animated: true,
        // markerEnd: { type: 'arrowclosed' },
        data: { configured: false },
        id: "111-121",
        source: "111",
        target: "121",
        type: "vector"
      }
    ]
    // viewport: { x: -1038.875, y: -587, zoom: 2 },
  });

  return (
    <div className="w-full h-full p-4">
      <VectorFlow
        data={initialValues}
        presetNodes={CustomNodeList}
        onChange={(t, d) => {
          // console.log('flow change', t, d)
        }}
        onConnectorClick={(n, c, o) => {
          // todo
          // console.log(2333333, n, c, o)

          o.nodes.forEach(e => {
            console.log("eeeee", e);
            if (e.id === n.id) {
              e.data = {
                ...e.data,
                connectorId: "conncccc-111"
              };
            }
          });
          setInitialValues({ ...o });
        }}
        onSave={(s, d, e) => {
          // todo
          d && setInitialValues({ ...d });
        }}
        onClear={() => {
          console.log("clear");
        }}
      />
    </div>
  );
}

export default App;
