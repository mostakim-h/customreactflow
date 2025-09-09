import React, {useCallback, useRef, useState} from "react";
import {FileText, Move} from "lucide-react";
import RotationHandle from "@/components/RotationHandle";
import ResizeHandle from "@/components/ResizHandle";
import CustomHandle from "@/components/CustomHandle";

export default function NoteNode({data}) {
  const [text, setText] = useState(data.text || 'Note');
  const [size, setSize] = useState(80);
  const [rotation, setRotation] = useState(data.rotation || 0);
  const nodeRef = useRef(null);
  const isResizing = useRef(false);
  const isRotating = useRef(false);
  const [dimensions, setDimensions] = useState({width: 40, height: 40});

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

      <div className="relative nodrag" style={{width: dimensions.width, height: dimensions.height}}>
        <div>
          <FileText size={16} className="text-amber-600 mb-2"/>
          <textarea
            className="bg-transparent text-xs font-medium text-amber-800 border-none outline-none w-full h-full resize-none"
            placeholder="Add your notes here..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
        </div>
      </div>

      <ResizeHandle position="bottom-right" mouseDown={handleResizeStart}/>
      <CustomHandle/>
    </div>
  );
};