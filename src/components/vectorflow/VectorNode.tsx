import React, { FC, memo, useCallback } from "react";
import { Handle, Position } from "reactflow";
import add from "../../assets/add.svg";

interface IProps {
  data: {
    label: string;
  };
  isConnectable: boolean;
}

const VectorNode: FC<IProps> = ({ data, isConnectable }) => {
  const onChange = useCallback((evt: any) => {
    console.log(evt.target.value);
  }, []);
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
        className="w-4 h-4 bg-transparent rounded-full translate-x-3 -translate-y-2 bg-cover bg-no-repeat"
        style={{ backgroundImage: `url(${add})`, fontSize: "10px" }}
      ></Handle>
    </>
  );
};

export default memo(VectorNode);
