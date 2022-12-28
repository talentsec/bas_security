import { FC } from "react";
import { Handle, Position } from "reactflow";
import add from "../../assets/add.svg";

interface IProps {
  isConnectable: boolean;
}

const EndNode: FC<IProps> = () => {
  return (
    <>
      <Handle
        type="target"
        position={Position.Left}
        className="w-4 h-4 bg-transparent rounded-full -translate-x-3 -translate-y-2 bg-cover bg-no-repeat"
        style={{ backgroundImage: `url(${add})`, fontSize: "10px" }}
      ></Handle>
      <div className="w-24 h-10 border border-[#dd582c] rounded flex justify-center items-center">
        <span className="p-2 text-xs truncate">结束</span>
      </div>
    </>
  );
};

export default EndNode;
