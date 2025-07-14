// src/components/GenericForm.jsx
import React from "react";

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
  return (
    <FormComponent
      session={session}
      year={year}
      editData={editData}
      onSuccess={onSuccess}
    />
  );
}

