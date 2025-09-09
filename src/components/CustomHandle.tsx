import {Handle, Position} from "@xyflow/react";
import React from "react";

export default function CustomHandle({positions = ["left", "right"] as Position[]}: {
  positions?: Position[]
}) {
  return (
    <>
      {positions.includes(Position.Right) && (
        <Handle
          type="source"
          position={Position.Right}
          className="w-3 h-3 bg-blue-500 rounded-full opacity-0 group-hover:opacity-100"
        />
      )}
      {positions.includes(Position.Left) && (
        <Handle
          type="target"
          position={Position.Left}
          className="w-3 h-3 bg-blue-500 rounded-full opacity-0 group-hover:opacity-100"
        />
      )}
    </>
  )
}