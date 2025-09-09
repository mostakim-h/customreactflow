import React, {useCallback, useRef, useState} from "react";
import {Move} from "lucide-react";
import RotationHandle from "@/components/RotationHandle";
import ResizeHandle from "@/components/ResizHandle";
import {Handle} from "@xyflow/react";
import CustomHandle from "@/components/CustomHandle";

export default function HexagonNode ({data, selected}) {
  const [text, setText] = useState(data.text || 'Hexagon');
  const [size, setSize] = useState(80);
  const [rotation, setRotation] = useState(data.rotation || 0);
  const nodeRef = useRef(null);
  const isResizing = useRef(false);
  const isRotating = useRef(false);

  const handleResizeStart = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    isResizing.current = true;
    const startX = e.clientX;
    const startSize = size;

    const handleMouseMove = (e) => {
      if (!isResizing.current) return;
      const deltaX = e.clientX - startX;
      setSize(Math.max(50, startSize + deltaX));
    };

    const handleMouseUp = () => {
      isResizing.current = false;
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  }, [size]);

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

      <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
        <svg className={`w-full h-full ${selected ? 'text-teal-500' : 'text-teal-400'}`} fill="currentColor" viewBox="0 0 24 24">
          <polygon points="12,2 18,7 18,17 12,22 6,17 6,7" stroke="currentColor" strokeWidth="2" />
        </svg>
        <input
          className="absolute bg-transparent text-center text-xs font-medium text-teal-800 border-none outline-none nodrag"
          style={{ width: size * 0.6 }}
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
      </div>

      <ResizeHandle position="bottom-right" mouseDown={handleResizeStart} />

      <CustomHandle/>

    </div>
  );
};