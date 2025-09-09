import React, {useCallback, useRef, useState} from "react";
import {Move} from "lucide-react";
import RotationHandle from "@/components/RotationHandle";
import ResizeHandle from "@/components/ResizHandle";
import CustomHandle from "@/components/CustomHandle";

export default function RectangleNode({data, selected}: any) {
  const [text, setText] = useState(data.text || 'Rectangle');
  const [dimensions, setDimensions] = useState({width: 128, height: 80});
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
    const startDimensions = {...dimensions};

    const handleMouseMove = (e) => {
      if (!isResizing.current) return;

      const deltaX = e.clientX - startX;
      const deltaY = e.clientY - startY;

      setDimensions({
        width: Math.max(80, startDimensions.width + deltaX),
        height: Math.max(40, startDimensions.height + deltaY)
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
    <div className="relative group" ref={nodeRef} style={{transform: `rotate(${rotation}deg)`}}>
      <div className="flex w-fit absolute -right-3 -top-3 justify-center mb-2 opacity-0 group-hover:opacity-100 z-10">
        <Move size={13} className="text-muted-foreground"/>
      </div>

      <RotationHandle onMouseDown={handleRotationStart}/>

      <div
        className={`bg-blue-100 border-2 ${selected ? 'border-blue-500' : 'border-blue-300'} rounded flex items-center justify-center nodrag`}
        style={{width: dimensions.width, height: dimensions.height}}
      >
        <input
          className="bg-transparent text-center text-sm font-medium text-blue-800 border-none outline-none w-full px-2"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
      </div>

      <ResizeHandle position="bottom-right" mouseDown={handleResizeStart}/>

      <CustomHandle/>

    </div>
  );
};