import React from "react";
import {
  motion,
  useMotionValue,
  useTransform,
  useAnimationFrame,
  AnimatePresence,
} from "framer-motion";
import { LuStar } from "react-icons/lu";
import { Colors } from "../lib/colors";

const SparkleIcon = ({ size, color }: { size: number; color: string }) => (
  <LuStar size={size} color={color} style={{ filter: "blur(0.5px)" }} />
);

const icons = [
  { id: 1, size: 20, color: Colors.lightPinkPurple, startX: 10, startY: 20 },
  { id: 2, size: 30, color: Colors.lightPurple, startX: 80, startY: 30 },
  { id: 3, size: 15, color: Colors.lightPink, startX: 90, startY: 80 },
  { id: 4, size: 25, color: Colors.lightPinkPurple, startX: 20, startY: 70 },
  { id: 5, size: 20, color: Colors.lightPurple, startX: 50, startY: 50 },
  { id: 6, size: 35, color: Colors.lightPink, startX: 5, startY: 90 },
  { id: 7, size: 20, color: Colors.lightPinkPurple, startX: 40, startY: 40 },
  { id: 8, size: 30, color: Colors.lightPurple, startX: 80, startY: 80 },
  { id: 9, size: 15, color: Colors.lightPink, startX: 20, startY: 60 },
  { id: 10, size: 25, color: Colors.lightPinkPurple, startX: 70, startY: 40 },
  { id: 11, size: 20, color: Colors.lightPurple, startX: 90, startY: 60 },
  { id: 12, size: 35, color: Colors.lightPink, startX: 5, startY: 70 },
];

const FloatingIcons = ({ isVisible = true }: { isVisible?: boolean }) => {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          style={styles.container}
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5 }}
          exit={{ opacity: 0 }}
        >
          {icons.map((icon) => (
            <AnimatedIcon key={icon.id} {...icon} />
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const AnimatedIcon = ({
  size,
  color,
  startX,
  startY,
}: {
  size: number;
  color: string;
  startX: number;
  startY: number;
}) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const radius = Math.random() * 2 + 10;
  const speed = Math.random() * 0.00005 + 0.001;
  const phase = Math.random() * Math.PI * 0.5;

  useAnimationFrame((t) => {
    const angle = t * speed + phase;
    const dx = Math.cos(angle) * radius;
    const dy = Math.sin(angle * 1.5) * radius;
    x.set(dx);
    y.set(dy);
  });

  const twinkle = useTransform(x, [-radius, 0, radius], [0.5, 1, 0.5]);
  const scale = useTransform(x, [-radius, 0, radius], [0.5, 0.8, 0.8]);

  return (
    <motion.div
      style={{
        ...styles.iconWrapper,
        left: `${startX}%`,
        top: `${startY}%`,
        x,
        y,
        opacity: twinkle,
        scale,
      }}
      initial={{ opacity: 0, scale: 0.2 }}
      animate={{ }}
      exit={{ opacity: 0, scale: 0.2 }}
      transition={{ duration: 0.6 }}
    >
      <SparkleIcon size={size} color={color} />
    </motion.div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    pointerEvents: "none",
    zIndex: 0,
  },
  iconWrapper: {
    position: "absolute",
    transform: "translate(-50%, -50%)",
  },
};

export default FloatingIcons;