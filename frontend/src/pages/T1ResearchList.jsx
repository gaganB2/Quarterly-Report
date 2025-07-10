// src/pages/T1ResearchList.jsx

import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Box,
  Grid,
  Typography,
  TextField,
  MenuItem,
  Button,
  CircularProgress,
  TableContainer,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  IconButton,
  Card,
  CardContent,
  CardActions,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Snackbar,
  Alert,
  useTheme,
  useMediaQuery,
  FormControl,
  FormLabel,
  FormGroup,
  FormControlLabel,
  Checkbox,
} from "@mui/material";

import { Delete, Edit } from "@mui/icons-material";
// import MainLayout from "../layout/MainLayout";
import apiClient from "../api/axios";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import DownloadIcon from "@mui/icons-material/Download";

export default function T1ResearchList() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const navigate = useNavigate();

  // State
  const [articles, setArticles] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [depsLoading, setDepsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterYear, setFilterYear] = useState("");
  const [filterQuarter, setFilterQuarter] = useState("");
  const [filterDept, setFilterDept] = useState("");
  const [deleteId, setDeleteId] = useState(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "info",
  });

  // Edit dialog state
  const [editOpen, setEditOpen] = useState(false);
  const [editData, setEditData] = useState(null);

  const debounce = useRef();

  // ---------- Export handler ----------
  const handleExport = () => {
    const exportData = filtered.map((a) => ({
      Title: a.title,
      Journal: a.journal_name,
      ISSN: a.issn_number,
      Impact: a.impact_factor,
      Internal: a.internal_authors,
      External: a.external_authors,
      Indexing: [
        a.indexing_wos && "WOS",
        a.indexing_scopus && "Scopus",
        a.indexing_ugc && "UGC",
        a.indexing_other,
      ]
        .filter(Boolean)
        .join(", "),
      Quarter: a.quarter,
      Year: a.year,
      Document: a.document_link,
    }));

    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "T1");
    const buf = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    saveAs(new Blob([buf]), "T1_Research_Articles.xlsx");
  };

  // ---------- Fetch submissions ----------
  const fetchData = () => {
    setLoading(true);
    const params = {};
    if (filterYear) params.year = filterYear;
    if (filterQuarter) params.quarter = filterQuarter;
    if (filterDept) params.department = filterDept;

    apiClient
      .get("api/faculty/t1research/", { params })
      .then(({ data }) => {
        setArticles(data);
        setFiltered(data);
      })
      .catch((err) => console.error("Fetch failed:", err))
      .finally(() => setLoading(false));
  };

  // ---------- Fetch departments ----------
  useEffect(() => {
    let mounted = true;
    apiClient
      .get("api/faculty/departments/")
      .then(({ data }) => {
        if (mounted) setDepartments(data);
      })
      .catch((err) => console.error("Deps fetch failed:", err))
      .finally(() => {
        if (mounted) setDepsLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, []);

  // Debounced fetch on filter change (including initial mount)
  useEffect(() => {
    clearTimeout(debounce.current);
    debounce.current = setTimeout(fetchData, 500);
    return () => clearTimeout(debounce.current);
  }, [filterYear, filterQuarter, filterDept]);

  // Local search effect
  useEffect(() => {
    const term = search.trim().toLowerCase();
    if (!term) {
      setFiltered(articles);
    } else {
      setFiltered(
        articles.filter(
          (a) =>
            a.title.toLowerCase().includes(term) ||
            a.journal_name.toLowerCase().includes(term)
        )
      );
    }
  }, [search, articles]);

  // ---------- Delete handlers ----------
  const confirmDelete = (id) => {
    setDeleteId(id);
    setConfirmOpen(true);
  };

  const handleDelete = () => {
    apiClient
      .delete(`api/faculty/t1research/${deleteId}/`)
      .then(() => {
        setSnackbar({
          open: true,
          message: "Deleted successfully",
          severity: "success",
        });
        fetchData();
      })
      .catch(() => {
        setSnackbar({
          open: true,
          message: "Delete failed",
          severity: "error",
        });
      })
      .finally(() => setConfirmOpen(false));
  };

  // ---------- Edit handlers ----------
  const handleEditOpen = (article) => {
    setEditData(article);
    setEditOpen(true);
  };

  const handleEditChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEditData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleEditSave = () => {
    apiClient
      .put(`api/faculty/t1research/${editData.id}/`, editData)
      .then(() => {
        setSnackbar({
          open: true,
          message: "Changes saved",
          severity: "success",
        });
        setEditOpen(false);
        fetchData();
      })
      .catch(() => {
        setSnackbar({
          open: true,
          message: "Failed to save changes",
          severity: "error",
        });
      });
  };

  return (
    // <MainLayout>
    <Container sx={{ mt: 4, mb: 4 }}>
      {/* Header */}
      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        flexWrap="wrap"
        mb={3}
      >
        <Typography variant="h5" fontWeight={600}>
          My Research Submissions
        </Typography>
        <Button
          variant="contained"
          onClick={() => navigate("/submit-t1")}
          sx={{ height: 48 }}
        >
          + New Submission
        </Button>
      </Box>

      {/* Sticky Filters */}
      <Paper
        sx={{
          position: "sticky",
          top: theme.mixins.toolbar.minHeight + 16,
          zIndex: 2,
          p: 2,
          mb: 2,
          backgroundColor: theme.palette.background.paper,
        }}
      >
        <Grid container spacing={2} alignItems="center">
          {/* Year: 12 cols on xs, 4 on sm, 2 on md */}
          <Grid item xs={12} sm={4} md={2}>
            <TextField
              label="Year"
              value={filterYear}
              onChange={(e) => setFilterYear(e.target.value.replace(/\D/, ""))}
              placeholder="2025"
              fullWidth
              size="small"
              sx={{ height: 48 }}
            />
          </Grid>

          {/* Quarter: 12 on xs, 4 on sm, 2 on md */}
          <Grid item xs={12} sm={4} md={2}>
            <TextField
              select
              label="Quarter"
              value={filterQuarter}
              onChange={(e) => setFilterQuarter(e.target.value)}
              fullWidth
              size="small"
              sx={{ height: 48 }}
            >
              <MenuItem value="">All</MenuItem>
              {["Q1", "Q2", "Q3", "Q4"].map((q) => (
                <MenuItem key={q} value={q}>
                  {q}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          {/* Department: 12 on xs, 8 on sm, 3 on md */}
          <Grid item xs={12} sm={8} md={3}>
            <TextField
              select
              label="Department"
              value={filterDept}
              onChange={(e) => setFilterDept(e.target.value)}
              fullWidth
              size="small"
              sx={{ height: 48 }}
              disabled={depsLoading}
            >
              <MenuItem value="">All</MenuItem>
              {departments.map((d) => (
                <MenuItem key={d.id} value={d.id}>
                  {d.name}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          {/* Search: 12 on xs, 12 on sm, 4 on md */}
          <Grid item xs={12} sm={12} md={4}>
            <TextField
              fullWidth
              placeholder="Search by title or journal…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              size="small"
              sx={{ height: 48 }}
            />
          </Grid>

          {/* Export: 12 on xs, 4 on sm, 1 on md, right-aligned */}
          <Grid
            item
            xs={12}
            sm={4}
            md={1}
            sx={{ textAlign: { xs: "left", sm: "right" } }}
          >
            <Button
              variant="contained"
              startIcon={<DownloadIcon />}
              onClick={handleExport}
              disabled={loading || !filtered.length}
              sx={{ height: 48 }}
            >
              Export
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {/* Content */}
      {loading ? (
        <Box display="flex" justifyContent="center" py={6}>
          <CircularProgress />
        </Box>
      ) : isMobile ? (
        /* Mobile Card View */
        <Grid container spacing={2}>
          {filtered.map((a) => (
            <Grid item xs={12} key={a.id}>
              <Card elevation={2}>
                <CardContent>
                  <Typography variant="h6" noWrap gutterBottom>
                    {a.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" noWrap>
                    {a.journal_name}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    ISSN: {a.issn_number} | IF: {a.impact_factor}
                  </Typography>
                </CardContent>
                <CardActions>
                  <IconButton color="primary" onClick={() => handleEditOpen(a)}>
                    <Edit />
                  </IconButton>
                  <IconButton color="error" onClick={() => confirmDelete(a.id)}>
                    <Delete />
                  </IconButton>
                  {a.document_link && (
                    <Button
                      size="small"
                      onClick={() => window.open(a.document_link, "_blank")}
                    >
                      View
                    </Button>
                  )}
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      ) : (
        /* Desktop Table View */
        <Box sx={{ overflowX: "auto" }}>
          <TableContainer component={Paper}>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  {[
                    "Title",
                    "Journal",
                    "ISSN",
                    "Impact",
                    "Internal",
                    "External",
                    "Indexing",
                    "Quarter",
                    "Year",
                    "Document",
                    "Actions",
                  ].map((h) => (
                    <TableCell
                      key={h}
                      sx={{
                        fontWeight: 600,
                        background: theme.palette.background.default,
                      }}
                    >
                      {h}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {filtered.map((a) => (
                  <TableRow hover key={a.id}>
                    <TableCell>{a.title}</TableCell>
                    <TableCell>{a.journal_name}</TableCell>
                    <TableCell>{a.issn_number}</TableCell>
                    <TableCell>{a.impact_factor}</TableCell>
                    <TableCell>{a.internal_authors}</TableCell>
                    <TableCell>{a.external_authors}</TableCell>
                    <TableCell>
                      {[
                        a.indexing_wos && "WOS",
                        a.indexing_scopus && "Scopus",
                        a.indexing_ugc && "UGC",
                        a.indexing_other,
                      ]
                        .filter(Boolean)
                        .join(", ")}
                    </TableCell>
                    <TableCell>{a.quarter}</TableCell>
                    <TableCell>{a.year}</TableCell>
                    <TableCell>
                      {a.document_link ? (
                        <Button
                          size="small"
                          onClick={() => window.open(a.document_link, "_blank")}
                        >
                          View
                        </Button>
                      ) : (
                        "—"
                      )}
                    </TableCell>
                    <TableCell>
                      <IconButton
                        color="primary"
                        onClick={() => handleEditOpen(a)}
                      >
                        <Edit />
                      </IconButton>
                      <IconButton
                        color="error"
                        onClick={() => confirmDelete(a.id)}
                      >
                        <Delete />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      )}

      {/* Delete Confirmation */}
      <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this submission? This cannot be
            undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmOpen(false)}>Cancel</Button>
          <Button onClick={handleDelete} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog
        open={editOpen}
        onClose={() => setEditOpen(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Edit Research Article</DialogTitle>
        <DialogContent dividers>
          {editData && (
            <Box component="form">
              <TextField
                margin="dense"
                fullWidth
                label="Title"
                name="title"
                value={editData.title}
                onChange={handleEditChange}
                required
              />
              <TextField
                margin="dense"
                fullWidth
                label="Journal Name"
                name="journal_name"
                value={editData.journal_name}
                onChange={handleEditChange}
              />
              <TextField
                margin="dense"
                fullWidth
                label="ISSN Number"
                name="issn_number"
                value={editData.issn_number}
                onChange={handleEditChange}
              />

              {/* Indexing */}
              <FormControl component="fieldset" sx={{ mt: 2 }}>
                <FormLabel component="legend">Indexing</FormLabel>
                <FormGroup row>
                  {[
                    { name: "indexing_wos", label: "Web of Science" },
                    { name: "indexing_scopus", label: "Scopus" },
                    { name: "indexing_ugc", label: "UGC-CARE" },
                  ].map((opt) => (
                    <FormControlLabel
                      key={opt.name}
                      control={
                        <Checkbox
                          name={opt.name}
                          checked={editData[opt.name] || false}
                          onChange={handleEditChange}
                        />
                      }
                      label={opt.label}
                    />
                  ))}
                </FormGroup>
              </FormControl>

              <TextField
                margin="dense"
                fullWidth
                label="Other Indexing"
                name="indexing_other"
                value={editData.indexing_other || ""}
                onChange={handleEditChange}
              />

              <TextField
                margin="dense"
                fullWidth
                label="Internal Authors"
                name="internal_authors"
                value={editData.internal_authors}
                onChange={handleEditChange}
              />
              <TextField
                margin="dense"
                fullWidth
                label="External Authors"
                name="external_authors"
                value={editData.external_authors}
                onChange={handleEditChange}
              />
              <TextField
                margin="dense"
                fullWidth
                label="Impact Factor"
                name="impact_factor"
                value={editData.impact_factor}
                onChange={handleEditChange}
              />
              <TextField
                margin="dense"
                fullWidth
                label="Document Link"
                name="document_link"
                value={editData.document_link}
                onChange={handleEditChange}
              />
              <TextField
                margin="dense"
                fullWidth
                select
                label="Quarter"
                name="quarter"
                value={editData.quarter}
                onChange={handleEditChange}
              >
                {["Q1", "Q2", "Q3", "Q4"].map((q) => (
                  <MenuItem key={q} value={q}>
                    {q}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                margin="dense"
                fullWidth
                select
                label="Department"
                name="department"
                value={editData.department || ""}
                onChange={handleEditChange}
              >
                {departments.map((d) => (
                  <MenuItem key={d.id} value={d.id}>
                    {d.name}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                margin="dense"
                fullWidth
                type="number"
                label="Year"
                name="year"
                value={editData.year}
                onChange={handleEditChange}
              />
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditOpen(false)}>Cancel</Button>
          <Button onClick={handleEditSave} variant="contained">
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
      >
        <Alert severity={snackbar.severity} variant="filled">
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
    // </MainLayout>
  );
}
