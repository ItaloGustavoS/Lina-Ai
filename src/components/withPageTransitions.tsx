'use client';

import { motion } from 'framer-motion';

const withPageTransitions = <P extends object>(WrappedComponent: React.ComponentType<P>) => {
  const Wrapper = (props: P) => {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
      >
        <WrappedComponent {...props} />
      </motion.div>
    );
  };

  return Wrapper;
};

export default withPageTransitions;
