import React from "react";
import { motion } from "framer-motion";

const CustomCursor = ({ mousex, mousey }) => (
  <motion.div
    className="cursor"
    variants={{default: {
      x: mousex -16,
      y: mousey -16,
  }}}
    animate="default"
    transition={{ type: "spring", stiffness: 500, damping: 30 }}
  />
);

export default CustomCursor;