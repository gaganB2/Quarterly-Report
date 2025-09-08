// src/components/FormTable.jsx

import React, { useState } from "react";
import {
  Box,
  Typography,
  Stack
} from "@mui/material";
import { formSections } from "../config/formConfig";
import FormRow from "./FormRow";
import { motion } from "framer-motion";

export default function FormTable({ filters, formCounts, countsLoading, visibleSections: visibleSectionsProp, FilterPanel, refreshCounts }) {
  const visibleSections = visibleSectionsProp || formSections;
  const [activeForm, setActiveForm] = useState(null);

  const handleToggleActive = (formCode) => {
    setActiveForm(prev => (prev === formCode ? null : formCode));
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.06, // A nice staggered effect for the cards
      },
    },
  };

  return (
    <Box> 
      <Stack 
        direction={{ xs: 'column', md: 'row' }} 
        justifyContent="space-between" 
        alignItems={{ xs: 'flex-start', md: 'center' }} 
        spacing={2} 
        sx={{ mb: 4, px: { xs: 1, sm: 0 } }} // Add some horizontal padding on mobile
      >
        <Typography variant="h4" fontWeight={800}>
          Submission Sections
        </Typography>
        
        {FilterPanel}
      </Stack>
      
      {/* The motion.div now wraps the entire list of cards */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {visibleSections.map((f, i) => {
          const isActive = activeForm === f.code;
          const count = formCounts[f.code] ?? null;

          return (
            <FormRow
              key={f.code}
              form={f}
              idx={i}
              filters={filters}
              isActive={isActive}
              onToggleActive={handleToggleActive}
              count={count}
              isLoadingCount={countsLoading}
              refreshCounts={refreshCounts}
            />
          );
        })}
      </motion.div>
    </Box>
  );
}