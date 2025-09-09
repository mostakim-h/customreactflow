import {Handle} from "@xyflow/react";
import ResizeHandle from "@/components/ResizHandle";
import {Database, Move} from "lucide-react";
import RotationHandle from "@/components/RotationHandle";
import React, {useCallback, useRef, useState} from "react";
import CustomHandle from "@/components/CustomHandle";

export default function DatabaseNode ({data, selected}){
  const [text, setText] = useState(data.text || 'Database');
  const [dimensions, setDimensions] = useState({ width: 100, height: 120 });
  const [rotation, setRotation] = useState(data.rotation || 0);
  const nodeRef = useRef(null);
  const isResizing = useRef(false);
  const isRotating = useRef(false);

  const handleResizeStart = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    isResizing.current = true;
    const startX = e.clientX;
    const startY = e.clientY;
    const startDimensions = { ...dimensions };

    const handleMouseMove = (e) => {
      if (!isResizing.current) return;

      const deltaX = e.clientX - startX;
      const deltaY = e.clientY - startY;

      setDimensions({
        width: Math.max(80, startDimensions.width + deltaX),
        height: Math.max(80, startDimensions.height + deltaY)
      });
    };

    const handleMouseUp = () => {
      isResizing.current = false;
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  }, [dimensions]);

  const handleRotationStart = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    isRotating.current = true;
    const startRotation = rotation;
    const rect = nodeRef.current?.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const startAngle = Math.atan2(e.clientY - centerY, e.clientX - centerX);

    const handleMouseMove = (e) => {
      if (!isRotating.current) return;

      const currentAngle = Math.atan2(e.clientY - centerY, e.clientX - centerX);
      const deltaAngle = (currentAngle - startAngle) * (180 / Math.PI);
      setRotation(startRotation + deltaAngle);
    };

    const handleMouseUp = () => {
      isRotating.current = false;
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  }, [rotation]);

  return (
    <div className="relative group" ref={nodeRef} style={{ transform: `rotate(${rotation}deg)` }}>
      <div className="flex w-fit absolute -right-3 -top-3 justify-center mb-2 opacity-0 group-hover:opacity-100 z-10">
        <Move size={13} className="text-muted-foreground"/>
      </div>

      <RotationHandle onMouseDown={handleRotationStart} />

      <div className="relative nodrag" style={{ width: dimensions.width, height: dimensions.height }}>
        {/* Database cylinder shape */}
        <svg className="w-full h-full" viewBox="0 0 100 120">
          <ellipse cx="50" cy="15" rx="45" ry="12" fill="#f0f9ff" stroke={selected ? '#3b82f6' : '#93c5fd'} strokeWidth="2"/>
          <rect x="5" y="15" width="90" height="90" fill="#f0f9ff" stroke={selected ? '#3b82f6' : '#93c5fd'} strokeWidth="2" strokeDasharray="0"/>
          <ellipse cx="50" cy="105" rx="45" ry="12" fill="#f0f9ff" stroke={selected ? '#3b82f6' : '#93c5fd'} strokeWidth="2"/>
          <line x1="5" y1="15" x2="5" y2="105" stroke={selected ? '#3b82f6' : '#93c5fd'} strokeWidth="2"/>
          <line x1="95" y1="15" x2="95" y2="105" stroke={selected ? '#3b82f6' : '#93c5fd'} strokeWidth="2"/>
        </svg>

        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <Database size={20} className="text-blue-600 mb-1" />
          <input
            className="bg-transparent text-center text-xs font-medium text-blue-800 border-none outline-none w-full px-2"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
        </div>
      </div>

      <ResizeHandle position="bottom-right" mouseDown={handleResizeStart} />

      <CustomHandle/>

    </div>
  );
};
