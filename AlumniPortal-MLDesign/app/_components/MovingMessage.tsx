import React from "react";
import { motion } from "framer-motion";

const MovingMessage = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="bg-[#F5F5F5] font-bold w-[98vw] overflow-hidden px-0 mx-auto">
      <motion.div
        initial={{ x: -1000 }} // Initial position outside the viewport
        animate={{ x: 1300 }} // Animation to move the children into view
        transition={{ duration: 10, repeat: Infinity }} // Spring animation effect
      >
        {children}
      </motion.div>
    </div>
  );
};

export default MovingMessage;
