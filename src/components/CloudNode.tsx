import React, {useCallback, useRef, useState} from "react";
import {Cloud, Move} from "lucide-react";
import RotationHandle from "@/components/RotationHandle";
import ResizeHandle from "@/components/ResizHandle";
import {Handle} from "@xyflow/react";
import CustomHandle from "@/components/CustomHandle";

export default function CloudNode ({data, selected}){
  const [text, setText] = useState(data.text || 'Cloud');
  const [size, setSize] = useState(100);
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
      setSize(Math.max(80, startSize + deltaX));
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

      <div className="relative flex items-center justify-center" style={{ width: size, height: size * 0.6 }}>
        {/* Cloud shape */}
        <svg className="w-full h-full" viewBox="0 0 100 60">
          <path
            d="M25,45 Q10,45 10,30 Q10,20 20,15 Q25,5 40,10 Q50,0 65,10 Q80,5 85,20 Q95,25 90,35 Q90,45 75,45 Z"
            fill="#e0f2fe"
            stroke={selected ? '#0ea5e9' : '#7dd3fc'}
            strokeWidth="2"
          />
        </svg>

        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <Cloud size={16} className="text-sky-600 mb-1" />
          <input
            className="bg-transparent text-center text-xs font-medium text-sky-800 border-none outline-none"
            style={{ width: size * 0.6 }}
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