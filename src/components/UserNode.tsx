import RotationHandle from "@/components/RotationHandle";
import {Move} from "lucide-react";
import {useCallback, useRef, useState} from "react";
import ResizeHandle from "@/components/ResizHandle";
import CustomHandle from "@/components/CustomHandle";

export default function UserNode ({data, selected}){
  const [text, setText] = useState(data.text || 'User');
  const [dimensions, setDimensions] = useState({ width: 80, height: 100 });
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
        width: Math.max(60, startDimensions.width + deltaX),
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
        {/* Stick figure */}
        <svg className="w-full h-full" viewBox="0 0 80 100">
          {/* Head */}
          <circle cx="40" cy="15" r="12" fill="#fef3c7" stroke={selected ? '#f59e0b' : '#fbbf24'} strokeWidth="2"/>
          {/* Body */}
          <line x1="40" y1="27" x2="40" y2="60" stroke={selected ? '#f59e0b' : '#fbbf24'} strokeWidth="3"/>
          {/* Arms */}
          <line x1="25" y1="40" x2="55" y2="40" stroke={selected ? '#f59e0b' : '#fbbf24'} strokeWidth="3"/>
          {/* Legs */}
          <line x1="40" y1="60" x2="25" y2="85" stroke={selected ? '#f59e0b' : '#fbbf24'} strokeWidth="3"/>
          <line x1="40" y1="60" x2="55" y2="85" stroke={selected ? '#f59e0b' : '#fbbf24'} strokeWidth="3"/>
        </svg>

        <div className="absolute bottom-0 left-0 right-0">
          <input
            className="bg-transparent text-center text-xs font-medium text-amber-800 border-none outline-none w-full"
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