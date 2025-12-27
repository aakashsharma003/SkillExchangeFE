import React from "react";
import { motion } from "framer-motion";

export const SealLogo: React.FC = () => {
  const text: string = "EXCHANGE YOUR SKILLS • ";

  return (
    <motion.div
      className="relative w-10 h-10 flex items-center justify-center cursor-pointer group"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      {/* Rotating Circular Text */}
      <motion.div
        className="absolute inset-0 flex items-center justify-center"
        animate={{ rotate: 360 }}
        transition={{ 
          duration: 10, 
          repeat: Infinity, 
          ease: "linear" 
        }}
      >
        <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible">
          <defs>
            <path 
              id="circlePath" 
              d="M 50, 50 m -37, 0 a 37,37 0 1,1 74,0 a 37,37 0 1,1 -74,0" 
            />
          </defs>
          <text className="text-[10px] font-bold fill-primary/80 uppercase tracking-widest">
            <textPath xlinkHref="#circlePath" startOffset="0%">
              {text.repeat(2)}
            </textPath>
          </text>
        </svg>
      </motion.div>

      {/* Central SE Logo */}
      <div className="relative z-10 w-7 h-7 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-[10px] font-bold text-primary-foreground shadow-sm ring-1 ring-background/50">
        SE
      </div>
    </motion.div>
  );
};

export default SealLogo;