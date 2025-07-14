// src/components/T1_1ViewModal.jsx

import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Paper,
  Link,
  IconButton,
  DialogContentText,
} from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";
import apiClient from "../api/axios";

export default function T1_1ViewModal({ open, onClose, session, year, onEdit }) {
  const [loading, setLoading] = useState(true);
  const [submissions, setSubmissions] = useState([]);
  const [deleteTarget, setDeleteTarget] = useState(null);

  useEffect(() => {
    if (open) {
      setLoading(true);
      apiClient
        .get("/api/faculty/t1research/", {
          params: { quarter: session, year: year },
        })
        .then((res) => {
          setSubmissions(res.data || []);
        })
        .catch(() => {
          setSubmissions([]);
        })
        .finally(() => setLoading(false));
    }
  }, [open, session, year]);

  const handleDelete = async (id) => {
    try {
      await apiClient.delete(`/api/faculty/t1research/${id}/`);
      setSubmissions((prev) => prev.filter((s) => s.id !== id));
      setDeleteTarget(null);
    } catch (err) {
      alert("Delete failed.");
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
      <DialogTitle>Submissions for T1.1 — {session} {year}</DialogTitle>

      <DialogContent dividers>
        {loading ? (
          <CircularProgress />
        ) : submissions.length === 0 ? (
          <Typography color="text.secondary">
            No submissions found for this quarter.
          </Typography>
        ) : (
          <TableContainer component={Paper}>
            <Table>
              <TableHead sx={{ backgroundColor: "#f5f5f5" }}>
                <TableRow>
                  <TableCell>Title</TableCell>
                  <TableCell>Journal</TableCell>
                  <TableCell>Authors</TableCell>
                  <TableCell>Impact</TableCell>
                  <TableCell>Indexing</TableCell>
                  <TableCell>Document</TableCell>
                  <TableCell align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {submissions.map((row) => (
                  <TableRow key={row.id}>
                    <TableCell>{row.title}</TableCell>
                    <TableCell>{row.journal_name}</TableCell>
                    <TableCell>
                      {row.internal_authors}
                      {row.external_authors && ` | ${row.external_authors}`}
                    </TableCell>
                    <TableCell>{row.impact_factor}</TableCell>
                    <TableCell>
                      {[
                        row.indexing_wos && "WOS",
                        row.indexing_scopus && "Scopus",
                        row.indexing_ugc && "UGC",
                        row.indexing_other,
                      ]
                        .filter(Boolean)
                        .join(", ")}
                    </TableCell>
                    <TableCell>
                      <Link href={row.document_link} target="_blank" rel="noopener">
                        View
                      </Link>
                    </TableCell>
                    <TableCell align="center">
                      <IconButton
                        onClick={() => {
                          onEdit?.(row);
                          onClose(); // close modal and trigger inline form
                        }}
                      >
                        <Edit fontSize="small" />
                      </IconButton>
                      <IconButton onClick={() => setDeleteTarget(row)}>
                        <Delete fontSize="small" color="error" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} variant="outlined">
          Close
        </Button>
      </DialogActions>

      {/* Delete confirmation */}
      <Dialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
      >
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete the submission titled:
            <strong> {deleteTarget?.title}</strong>?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteTarget(null)}>Cancel</Button>
          <Button
            onClick={() => handleDelete(deleteTarget.id)}
            color="error"
            variant="contained"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Dialog>
  );
}
