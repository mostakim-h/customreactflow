import React, {useCallback, useRef, useState} from "react";
import {Move} from "lucide-react";
import {Textarea} from "@/components/ui/textarea";
import ResizeHandle from "@/components/ResizHandle";
import RotationHandle from "@/components/RotationHandle";
import CustomHandle from "@/components/CustomHandle";

export default function TextNode({data, selected}: any) {
  const [text, setText] = useState(data.text || '');
  const [dimensions, setDimensions] = useState({width: 200, height: 100});
  const [rotation, setRotation] = useState(data.rotation || 0);
  const nodeRef = useRef(null);
  const isResizing = useRef(false);
  const isRotating = useRef(false);
  const startPos = useRef({x: 0, y: 0});
  const startDimensions = useRef({width: 200, height: 100});
  const startRotation = useRef(0);

  const handleResizeStart = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    isResizing.current = true;
    startPos.current = {x: e.clientX, y: e.clientY};
    startDimensions.current = {...dimensions};

    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing.current) return;

      const deltaX = e.clientX - startPos.current.x;
      const deltaY = e.clientY - startPos.current.y;

      const newWidth = Math.max(100, startDimensions.current.width + deltaX);
      const newHeight = Math.max(50, startDimensions.current.height + deltaY);

      setDimensions({width: newWidth, height: newHeight});
    };

    const handleMouseUp = () => {
      isResizing.current = false;
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  }, [dimensions]);

  const handleRotationStart = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    isRotating.current = true;
    startRotation.current = rotation;
    const rect = nodeRef.current?.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const startAngle = Math.atan2(e.clientY - centerY, e.clientX - centerX);

    const handleMouseMove = (e: MouseEvent) => {
      if (!isRotating.current) return;

      const currentAngle = Math.atan2(e.clientY - centerY, e.clientX - centerX);
      const deltaAngle = (currentAngle - startAngle) * (180 / Math.PI);
      setRotation(startRotation.current + deltaAngle);
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

      <div className="relative w-full h-full nodrag" style={{width: dimensions.width, height: dimensions.height}}>
        <Textarea
          className={`w-full h-full resize-none bg-white border-2 ${selected ? 'border-blue-500' : 'border-gray-300'}`}
          placeholder="Enter text..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          style={{width: '100%', height: '100%'}}
        />
      </div>

      <ResizeHandle position="bottom-right" mouseDown={(e: React.MouseEvent) => handleResizeStart(e)}/>

      <CustomHandle/>

    </div>
  );
};