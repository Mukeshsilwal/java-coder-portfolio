import React from 'react';
import Education from '@/components/Education';
import { motion } from 'framer-motion';

const EducationPage = () => {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="pt-20"
        >
            <Education />
        </motion.div>
    );
};

export default EducationPage;
