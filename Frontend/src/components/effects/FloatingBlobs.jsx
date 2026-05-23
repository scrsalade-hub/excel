import { motion } from "framer-motion";

export default function FloatingBlobs() {
  return (
    <>
      <motion.div
        className="absolute -top-40 -right-40 w-[500px] h-[500px] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(220,38,38,0.06) 0%, transparent 70%)", filter: "blur(80px)" }}
        animate={{ y: [0, -30, 0], x: [0, 20, 0] }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute top-1/3 -left-60 w-[450px] h-[450px] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(220,38,38,0.04) 0%, transparent 70%)", filter: "blur(90px)" }}
        animate={{ y: [0, 20, 0], x: [0, -15, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 2 }}
      />
      <motion.div
        className="absolute bottom-20 right-1/4 w-[350px] h-[350px] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(248,113,113,0.05) 0%, transparent 70%)", filter: "blur(70px)" }}
        animate={{ y: [0, -25, 0], scale: [1, 1.08, 1] }}
        transition={{ duration: 16, repeat: Infinity, ease: "easeInOut", delay: 4 }}
      />
    </>
  );
}
