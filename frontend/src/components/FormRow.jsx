import React, { useState } from "react";
import { TableRow, TableCell, Button, Collapse, Box } from "@mui/material";
import apiClient from "../api/axios";
import { formConfig } from "../config/formConfig";
import GenericList from "./GenericList";
import GenericForm from "./GenericForm";

export default function FormRow({ form, idx, autoViewGen }) {
  const [expanded, setExpanded] = useState(false);
  const [mode, setMode] = useState("add"); // "add" | "view" | "edit" | "delete"
  const [data, setData] = useState([]);
  const [editData, setEditData] = useState(null);

  const cfg = formConfig[form.code];
  if (!cfg || !cfg.endpoint) return null;

  // Fetch all entries for this section
  const loadData = async () => {
    const res = await apiClient.get(cfg.endpoint);
    setData(res.data);
  };

  const handleOpen = async (newMode) => {
    setMode(newMode);
    setEditData(null);
    if (newMode !== "add") {
      await loadData();
    }
    setExpanded((prev) => !(prev && mode === newMode));
  };

  const handleEditItem = (item) => {
    setEditData(item);
    setMode("edit");
    setExpanded(true);
  };

  const handleDeleteItem = async (item) => {
    await apiClient.delete(`${cfg.endpoint}${item.id}/`);
    await loadData();
  };

  return (
    <>
      <TableRow hover>
        <TableCell>{idx + 1}</TableCell>
        <TableCell>
          <strong>{form.code}</strong> — {form.title}
        </TableCell>
        <TableCell align="right">
          <Button size="small" onClick={() => handleOpen("add")} sx={{ mr: 1 }}>
            {expanded && mode === "add" ? "Close" : "Add"}
          </Button>
          <Button size="small" onClick={() => handleOpen("view")} sx={{ mr: 1 }}>
            View
          </Button>
          <Button size="small" onClick={() => handleOpen("edit")} sx={{ mr: 1 }}>
            Edit
          </Button>
          <Button size="small" color="error" onClick={() => handleOpen("delete")}>
            Delete
          </Button>
        </TableCell>
      </TableRow>

      {expanded && (
        <TableRow>
          <TableCell colSpan={3} sx={{ p: 0, border: 0 }}>
            <Collapse in timeout="auto" unmountOnExit>
              <Box m={2}>
                {mode === "add" && (
                  <GenericForm
                    FormComponent={cfg.FormComponent}
                    onSuccess={() => setExpanded(false)}
                  />
                )}

                {(mode === "view" || mode === "edit" || mode === "delete") && (
                  <GenericList
                    data={data}
                    fields={cfg.listFields || []}
                    mode={mode}
                    onEdit={handleEditItem}
                    onDelete={handleDeleteItem}
                  />
                )}

                {mode === "edit" && editData && (
                  <Box mt={2}>
                    <GenericForm
                      FormComponent={cfg.FormComponent}
                      editData={editData}
                      onSuccess={() => setExpanded(false)}
                    />
                  </Box>
                )}
              </Box>
            </Collapse>
          </TableCell>
        </TableRow>
      )}
    </>
  );
}
