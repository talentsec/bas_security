import type { FC } from "react";
import React, { memo } from "react";

import { SourceBox } from "./SourceBox";
import { StatefulTargetBox as TargetBox } from "./TargetBox";
import { ComponentsList } from "./SourceBox";

interface PropsType {
  confirm: any;
  data: any;
  cancel: () => void;
}

export const Container = memo(function Container({ confirm, data, cancel }: PropsType) {
  return (
    <div className="flex h-full">
      <div className="w-72 p-4 h-full bg-white ">
        <section className="font-bold text-base py-4">通用组件</section>
        <section className="flex flex-wrap gap-4">
          {Object.keys(ComponentsList).map(item => {
            return <SourceBox key={item} type={item}></SourceBox>;
          })}
        </section>
      </div>

      <div className="flex-1 flex justify-center overflow-auto">
        <div className="w-full ">
          <TargetBox confirm={confirm} data={data} cancel={cancel} />
        </div>
      </div>
    </div>
  );
});
