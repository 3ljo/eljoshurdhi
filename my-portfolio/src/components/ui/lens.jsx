import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function Lens({
  children,
  zoomFactor = 1.5,
  lensSize = 170,
  hovering,
  setHovering,
}) {
  const containerRef = useRef(null);
  const [localHovering, setLocalHovering] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const isHovering = hovering !== undefined ? hovering : localHovering;
  const setIsHovering = setHovering || setLocalHovering;

  const handleMouseMove = useCallback((e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    setPosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative overflow-hidden rounded-2xl"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      onMouseMove={handleMouseMove}
    >
      {children}

      <AnimatePresence>
        {isHovering && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="absolute pointer-events-none z-50"
            style={{
              width: lensSize,
              height: lensSize,
              left: position.x - lensSize / 2,
              top: position.y - lensSize / 2,
              borderRadius: "50%",
              border: "2px solid rgba(255,255,255,0.3)",
              boxShadow: "0 8px 32px rgba(0,0,0,0.3), inset 0 0 20px rgba(255,255,255,0.05)",
              overflow: "hidden",
              background: "transparent",
            }}
          >
            <div
              style={{
                position: "absolute",
                width: containerRef.current?.offsetWidth * zoomFactor,
                height: containerRef.current?.offsetHeight * zoomFactor,
                left: -(position.x * zoomFactor - lensSize / 2),
                top: -(position.y * zoomFactor - lensSize / 2),
                transformOrigin: "0 0",
              }}
            >
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
