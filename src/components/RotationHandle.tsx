import {RotateCw} from "lucide-react";

export default function RotationHandle({onMouseDown}) {
  return (
    <div
      className="absolute nodrag -top-8 left-1/2 transform -translate-x-1/2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center cursor-grab opacity-0 group-hover:opacity-100 z-20"
      onMouseDown={onMouseDown}
    >
      <RotateCw size={12} className="text-white"/>
    </div>
  );
};
