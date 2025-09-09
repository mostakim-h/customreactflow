import React from "react";

export default function ResizeHandle ({mouseDown, position} : {mouseDown: React.MouseEventHandler<HTMLDivElement>, position: string}){
  return (
    <div
      className={`absolute nodrag w-3 h-3 bg-blue-500 border border-white rounded-sm cursor-nw-resize opacity-0 group-hover:opacity-100 z-20 ${
        position === 'top-left' ? '-top-1 -left-1' :
          position === 'top-right' ? '-top-1 -right-1' :
            position === 'bottom-left' ? '-bottom-1 -left-1' :
              '-bottom-1 -right-1'
      }`}
      onMouseDown={mouseDown}
    />
  );
};