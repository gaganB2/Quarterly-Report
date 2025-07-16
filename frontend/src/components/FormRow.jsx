// src/components/FormRow.jsx
import React, { useState, useEffect } from "react";
import { TableRow, TableCell, Button, Collapse, Box } from "@mui/material";
import apiClient from "../api/axios";
import { formConfig } from "../config/formConfig";
import GenericList from "./GenericList";
import GenericForm from "./GenericForm";

export default function FormRow({
  form,
  idx,
  filters,
  autoViewGen, // generation counter for auto-view
}) {
  const { session, year, title, journal } = filters;
  const [expanded, setExpanded] = useState(false);
  const [mode, setMode] = useState("add"); // "add" | "view" | "edit" | "delete"
  const [data, setData] = useState([]);
  const [editData, setEditData] = useState(null);
  const [lastGen, setLastGen] = useState(0);

  const cfg = formConfig[form.code];
  if (!cfg || !cfg.endpoint) return null;

  // load and client-filter data
  const loadData = async () => {
    const res = await apiClient.get(cfg.endpoint);
    let items = res.data;
    if (title) {
      items = items.filter((i) =>
        i.title.toLowerCase().includes(title.toLowerCase())
      );
    }
    if (journal) {
      items = items.filter((i) =>
        (i.journal_name || "").toLowerCase().includes(journal.toLowerCase())
      );
    }
    setData(items);
    return items;
  };

  // auto-expand in "view" when filters change
  useEffect(() => {
    async function tryAutoView() {
      if (
        (filters.form === "" || filters.form === form.code) &&
        autoViewGen !== lastGen
      ) {
        const items = await loadData();
        if (items.length > 0) {
          setMode("view");
          setExpanded(true);
        } else {
          setExpanded(false);
        }
        setLastGen(autoViewGen);
      }
    }
    tryAutoView();
  }, [
    autoViewGen,
    filters.form,
    filters.session,
    filters.year,
    filters.title,
    filters.journal,
  ]);

  // manual Add/View/Edit/Delete
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
  };

  const handleDeleteItem = async (item) => {
    if (!window.confirm(`Delete "${item.title}"?`)) return;
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

      <TableRow>
        <TableCell colSpan={3} sx={{ p: 0, border: 0 }}>
          <Collapse in={expanded} timeout="auto" unmountOnExit>
            <Box m={2}>
              {mode === "add" && (
                <GenericForm
                  FormComponent={cfg.FormComponent}
                  session={session}
                  year={year}
                  onSuccess={() => setExpanded(false)}
                />
              )}

              {["view", "edit", "delete"].includes(mode) && (
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
                    session={session}
                    year={year}
                    editData={editData}
                    onSuccess={() => setExpanded(false)}
                  />
                </Box>
              )}
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
}
