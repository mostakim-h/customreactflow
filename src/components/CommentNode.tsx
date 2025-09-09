import {useCallback, useRef, useState} from "react";
import {MessageSquare, Move} from "lucide-react";
import RotationHandle from "@/components/RotationHandle";
import ResizeHandle from "@/components/ResizHandle";

export default function CommentNode ({data, selected}) {
  const [text, setText] = useState(data.text || 'Comment');
  const [dimensions, setDimensions] = useState({ width: 140, height: 80 });
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
        width: Math.max(100, startDimensions.width + deltaX),
        height: Math.max(60, startDimensions.height + deltaY)
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
        {/* Speech bubble shape */}
        <svg className="w-full h-full" viewBox={`0 0 ${dimensions.width} ${dimensions.height}`}>
          <defs>
            <path id="bubblePath" d={`M10,10 L${dimensions.width-10},10 Q${dimensions.width-5},10 ${dimensions.width-5},15 L${dimensions.width-5},${dimensions.height-25} Q${dimensions.width-5},${dimensions.height-20} ${dimensions.width-10},${dimensions.height-20} L25,${dimensions.height-20} L15,${dimensions.height-5} L20,${dimensions.height-20} L10,${dimensions.height-20} Q5,${dimensions.height-20} 5,${dimensions.height-25} L5,15 Q5,10 10,10`}/>
          </defs>
          <use href="#bubblePath" fill="#f3f4f6" stroke={selected ? '#6b7280' : '#9ca3af'} strokeWidth="2"/>
        </svg>

        <div className="absolute inset-4" style={{ paddingBottom: '16px' }}>
          <MessageSquare size={14} className="text-gray-600 mb-1" />
          <textarea
            className="bg-transparent text-xs font-medium text-gray-700 border-none outline-none w-full h-full resize-none"
            placeholder="Add comment..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
        </div>
      </div>

      <ResizeHandle position="bottom-right" mouseDown={handleResizeStart} />

      {/* No handles for comment nodes as they're typically annotations */}
    </div>
  );
};