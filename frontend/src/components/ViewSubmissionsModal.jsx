// src/components/ViewSubmissionsModal.jsx
import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  CircularProgress,
  Table,
  TableHead,
  TableBody,
  TableCell,
  TableRow,
  Typography,
} from "@mui/material";
import apiClient from "../api/axios";

const ViewSubmissionsModal = ({ open, onClose, quarter, year }) => {
  const [loading, setLoading] = useState(true);
  const [submissions, setSubmissions] = useState([]);

  useEffect(() => {
    if (!open) return;
    setLoading(true);
    apiClient
      .get(`/api/faculty/t1research/?quarter=${quarter}&year=${year}`, {
        headers: {
          Authorization: `Token ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => setSubmissions(res.data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [open, quarter, year]);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
      <DialogTitle>My Submissions (T1.1)</DialogTitle>
      <DialogContent dividers>
        {loading ? (
          <CircularProgress />
        ) : submissions.length === 0 ? (
          <Typography>No submissions found for this session.</Typography>
        ) : (
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Title</TableCell>
                <TableCell>Journal</TableCell>
                <TableCell>Quarter</TableCell>
                <TableCell>Year</TableCell>
                <TableCell>ISSN</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {submissions.map((item, idx) => (
                <TableRow key={idx}>
                  <TableCell>{item.title}</TableCell>
                  <TableCell>{item.journal_name}</TableCell>
                  <TableCell>{item.quarter}</TableCell>
                  <TableCell>{item.year}</TableCell>
                  <TableCell>{item.issn_number}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} variant="contained">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ViewSubmissionsModal;
