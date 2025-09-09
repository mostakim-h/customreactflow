import React, {useCallback, useRef, useState} from "react";
import {Move} from "lucide-react";
import RotationHandle from "@/components/RotationHandle";
import CustomHandle from "@/components/CustomHandle";

export default function LineNode({data, selected}: any) {
  const [length, setLength] = useState(128);
  const [rotation, setRotation] = useState(data.rotation || 0);
  const nodeRef = useRef(null);
  const isResizing = useRef(false);
  const isRotating = useRef(false);

  const handleResizeStart = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    isResizing.current = true;
    const startX = e.clientX;
    const startLength = length;

    const handleMouseMove = (e) => {
      if (!isResizing.current) return;
      const deltaX = e.clientX - startX;
      setLength(Math.max(60, startLength + deltaX));
    };

    const handleMouseUp = () => {
      isResizing.current = false;
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  }, [length]);

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
    <div className="relative group" ref={nodeRef} style={{transform: `rotate(${rotation}deg)`}}>
      <div className="flex w-fit absolute -right-3 -top-3 justify-center mb-2 opacity-0 group-hover:opacity-100 z-10">
        <Move size={13} className="text-muted-foreground"/>
      </div>

      <RotationHandle onMouseDown={handleRotationStart}/>

      <div
        className={`h-1 ${selected ? 'bg-red-500' : 'bg-red-400'} rounded`}
        style={{width: length}}
      />

      <div
        className="absolute w-3 nodrag h-3 bg-blue-500 border border-white rounded-sm cursor-ew-resize opacity-0 group-hover:opacity-100 z-20 top-1/2 -right-1 transform -translate-y-1/2"
        onMouseDown={handleResizeStart}
      />

      <CustomHandle/>

    </div>
  );
};