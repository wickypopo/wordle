export default function PageTransition({ children }) {
  return (
    <AnimatePresence initial={false}>
      <motion.div
        initial={{ x: 1000 }}
        animate={{ x: 0 }}
        exit={{ x: -1000 }}
        transition={{ type: "spring", duration: 0.5 }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
