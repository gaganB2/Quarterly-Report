// src/components/GenericForm.jsx
import React, { Suspense } from 'react';
import { Box, CircularProgress } from '@mui/material';

export default function GenericForm({
  FormComponent,
  session,
  year,
  editData,
  onSuccess,
}) {
  if (!FormComponent) {
    return <em>Form for this section not implemented yet.</em>;
  }

  // The <Suspense> component is required by React to handle components
  // that are loaded dynamically with React.lazy(). It shows a fallback UI
  // (in this case, a loading spinner) while the browser downloads the
  // code for the specific form component the user requested.
  return (
    <Suspense fallback={
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    }>
      <FormComponent
        session={session}
        year={year}
        editData={editData}
        onSuccess={onSuccess}
      />
    </Suspense>
  );
}