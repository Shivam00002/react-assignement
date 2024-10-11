import React, { useState, useRef, useEffect } from 'react';

interface Rectangle {
  id: number;
  x: number;
  y: number;
  width: number;
  height: number;
}


const ImageAnnotator: React.FC = () => {
  const [rectangles, setRectangles] = useState<Rectangle[]>([
    { id: 1, x: 50, y: 50, width: 100, height: 100 },
    { id: 2, x: 200, y: 50, width: 100, height: 100 },
    { id: 3, x: 350, y: 50, width: 100, height: 100 },
    { id: 4, x: 50, y: 200, width: 100, height: 100 },
    { id: 5, x: 200, y: 200, width: 100, height: 100 },
  ]);

  const [draggingRect, setDraggingRect] = useState<number | null>(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = (e: React.MouseEvent, id: number) => {
    e.preventDefault();
    setDraggingRect(id);
    const rect = rectangles.find(r => r.id === id);
    if (rect && containerRef.current) {
      const containerRect = containerRef.current.getBoundingClientRect();
      setOffset({
        x: e.clientX - containerRect.left - rect.x,
        y: e.clientY - containerRect.top - rect.y,
      });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (draggingRect !== null && containerRef.current) {
      const containerRect = containerRef.current.getBoundingClientRect();
      const newX = Math.round(e.clientX - containerRect.left - offset.x);
      const newY = Math.round(e.clientY - containerRect.top - offset.y);

      setRectangles(prevRects =>
        prevRects.map(rect =>
          rect.id === draggingRect
            ? {
                ...rect,
                x: Math.max(0, Math.min(newX, containerRect.width - rect.width)),
                y: Math.max(0, Math.min(newY, containerRect.height - rect.height)),
              }
            : rect
        )
      );
    }
  };

  const handleMouseUp = () => {
    setDraggingRect(null);
  };

  useEffect(() => {
    if (draggingRect === null) {
      console.log('Final rectangle positions:', rectangles);
    }
  }, [draggingRect, rectangles]);

  return (
    <div className="flex w-full flex-col items-center">
      <div 
        ref={containerRef}
        className="relative border w-full h-[100vh] md:h-[600px] sm:h-[400px] border-gray-300"
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <img
          src="https://img.freepik.com/free-photo/view-computer-monitor-display_23-2150757436.jpg"
          alt="Annotatable image"
          className="w-full h-full object-cover"
        />
        {rectangles.map(rect => (
          <div
            key={rect.id}
            className="absolute border-2 border-red-500 bg-black rounded-md cursor-move text-center flex items-center justify-center"
            style={{
              left: `${rect.x}px`,
              top: `${rect.y}px`,
              width: `${rect.width}px`,
              height: `${rect.height}px`,
            }}
            onMouseDown={(e) => handleMouseDown(e, rect.id)}
          >
            <div>
              <span className='text-white text-sm'>Box no. {rect.id}</span><br />
              <span className="text-xs text-white bg-black bg-opacity-50 p-1 rounded">
                {`(${rect.x}, ${rect.y})`}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ImageAnnotator;
