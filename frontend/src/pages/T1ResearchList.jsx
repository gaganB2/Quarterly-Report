import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  TextField,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
  Box,
  MenuItem,
} from "@mui/material";
// import { Delete } from "@mui/icons-material";
import { Delete, Edit } from "@mui/icons-material";
import { Snackbar, Alert } from "@mui/material";
import { useRef } from "react";
import axios from "axios";

const T1ResearchList = () => {
  const [articles, setArticles] = useState([]);
  const [filteredArticles, setFilteredArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const [deleteId, setDeleteId] = useState(null);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const [editOpen, setEditOpen] = useState(false); // NEW: edit dialog toggle
  const [editData, setEditData] = useState(null); // NEW: form data to edit
  const [filterYear, setFilterYear] = useState("");
  // const [yearFilter, setYearFilter] = useState("");
  const [filterQuarter, setFilterQuarter] = useState("");
  const debounceTimer = useRef(null);

  // const [quarterFilter, setQuarterFilter] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("");

  const [departments, setDepartments] = useState([]);

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "info",
  });

  const token = localStorage.getItem("token");

  // ✅ API call: filtered fetch from backend
  const fetchData = () => {
    setLoading(true);

    const params = {};
    if (filterYear) params.year = filterYear;
    if (filterQuarter) params.quarter = filterQuarter;
    if (departmentFilter) params.department = departmentFilter;

    axios
      .get("http://127.0.0.1:8000/api/faculty/t1research/", {
        headers: { Authorization: `Token ${token}` },
        params,
      })
      .then((res) => {
        setArticles(res.data); // Full list
        setFilteredArticles(res.data); // Start with same
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load submissions", err);
        setLoading(false);
      });
  };

  useEffect(() => {
    if (token) {
      fetchData();
    }
  }, [token, filterQuarter, departmentFilter]);

  // ✅ 🏛️ Load departments once
  useEffect(() => {
    if (!token) return;

    axios
      .get("http://127.0.0.1:8000/api/faculty/departments/", {
        headers: { Authorization: `Token ${token}` },
      })
      .then((res) => setDepartments(res.data))
      .catch((err) => console.error("Failed to load departments", err));
  }, [token]);

  // ✅ 🔍 Local search across current `articles`
  useEffect(() => {
    if (!articles.length) return;
    handleSearch();
  }, [searchQuery, articles]);

  // ✅ Search Handler
  const handleSearch = () => {
    let filtered = articles;

    if (searchQuery.trim()) {
      filtered = filtered.filter(
        (article) =>
          article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          article.journal_name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredArticles(filtered);
  };

  const handleDelete = () => {
    axios
      .delete(`http://127.0.0.1:8000/api/faculty/t1research/${deleteId}/`, {
        headers: { Authorization: `Token ${token}` },
      })
      .then(() => {
        setConfirmOpen(false);
        setDeleteId(null);
        fetchData();
      })
      .catch((err) => {
        console.error("Deletion failed", err);
        setConfirmOpen(false);
        setDeleteId(null);
      });
  };

  const confirmDelete = (id) => {
    setDeleteId(id);
    setConfirmOpen(true);
  };
  const handleEditOpen = (article) => {
    setEditData(article);
    setEditOpen(true);
  };

  const handleEditChange = (e) => {
    setEditData({ ...editData, [e.target.name]: e.target.value });
  };

  const handleEditSave = () => {
    axios
      .put(
        `http://127.0.0.1:8000/api/faculty/t1research/${editData.id}/`,
        editData,
        {
          headers: { Authorization: `Token ${token}` },
        }
      )
      .then(() => {
        setEditOpen(false);
        fetchData();
        setSnackbar({
          open: true,
          message: "Changes saved successfully",
          severity: "success",
        });
      })
      .catch((err) => {
        console.error("Edit failed", err);
        setSnackbar({
          open: true,
          message: "Failed to save changes",
          severity: "error",
        });
        setEditOpen(false);
      });
  };

  if (loading) {
    return (
      <Container sx={{ mt: 4 }}>
        <Typography variant="h6">Loading Submissions...</Typography>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h5" gutterBottom>
        My Submitted Research Articles (T1.1)
      </Typography>
      <Box display="flex" gap={2} mt={2}>
        <TextField
          label="Year"
          type="text"
          value={filterYear}
          onChange={(e) => {
            const val = e.target.value;
            if (/^\d{0,4}$/.test(val)) {
              setFilterYear(val);
            }
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              const yearInt = parseInt(filterYear, 10);
              if (!isNaN(yearInt) && yearInt >= 2000 && yearInt <= 2100) {
                setFilterYear(yearInt.toString()); // Normalize
                fetchData(); // ✅ Trigger fetch manually
              } else {
                setFilterYear("");
              }
            }
          }}
          placeholder="e.g. 2025"
          size="small"
          sx={{ mr: 2 }}
        />

        <TextField
          label="Quarter"
          select
          value={filterQuarter}
          onChange={(e) => setFilterQuarter(e.target.value)}
          size="small"
          sx={{ minWidth: 120 }}
        >
          <MenuItem value="">All</MenuItem>
          <MenuItem value="Q1">Q1</MenuItem>
          <MenuItem value="Q2">Q2</MenuItem>
          <MenuItem value="Q3">Q3</MenuItem>
          <MenuItem value="Q4">Q4</MenuItem>
        </TextField>

        <TextField
          select
          label="Department"
          value={departmentFilter}
          onChange={(e) => setDepartmentFilter(e.target.value)}
          size="small"
          sx={{ mr: 2, minWidth: 180 }}
        >
          <MenuItem value="">All Departments</MenuItem>
          {departments.map((dept) => (
            <MenuItem key={dept.id} value={dept.id}>
              {dept.name}
            </MenuItem>
          ))}
        </TextField>
      </Box>

      <TextField
        fullWidth
        label="Title or Journal"
        value={searchQuery}
        onChange={(e) => {
          setSearchQuery(e.target.value);
          handleSearch();
        }}
        margin="normal"
      />

      {filteredArticles.length === 0 ? (
        <Typography>No matching submissions found.</Typography>
      ) : (
        <TableContainer component={Paper} sx={{ mt: 2 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Title</TableCell>
                <TableCell>Journal Name</TableCell>
                <TableCell>ISSN</TableCell>
                <TableCell>Impact Factor</TableCell>
                <TableCell>Quarter</TableCell>
                <TableCell>Year</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredArticles.map((article) => (
                <TableRow key={article.id}>
                  <TableCell>{article.title}</TableCell>
                  <TableCell>{article.journal_name}</TableCell>
                  <TableCell>{article.issn_number}</TableCell>
                  <TableCell>{article.impact_factor}</TableCell>
                  <TableCell>{article.quarter}</TableCell>
                  <TableCell>{article.year}</TableCell>
                  {/* <TableCell align="center">
                    <IconButton
                      color="error"
                      onClick={() => confirmDelete(article.id)}
                    >
                      <Delete />
                    </IconButton>
                  </TableCell> */}
                  <TableCell align="center">
                    <IconButton
                      color="primary"
                      onClick={() => {
                        setEditData(article);
                        setEditOpen(true);
                      }}
                    >
                      <Edit />
                    </IconButton>
                    <IconButton
                      color="error"
                      onClick={() => confirmDelete(article.id)}
                    >
                      <Delete />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this research article?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmOpen(false)} color="inherit">
            Cancel
          </Button>
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
        <DialogContent>
          {editData && (
            <>
              <TextField
                fullWidth
                label="Title"
                name="title"
                value={editData.title}
                onChange={(e) =>
                  setEditData({ ...editData, title: e.target.value })
                }
                margin="dense"
                required
              />
              <TextField
                fullWidth
                label="Journal Name"
                name="journal_name"
                value={editData.journal_name}
                onChange={(e) =>
                  setEditData({ ...editData, journal_name: e.target.value })
                }
                margin="dense"
              />
              <TextField
                fullWidth
                label="ISSN Number"
                name="issn_number"
                value={editData.issn_number}
                onChange={(e) =>
                  setEditData({ ...editData, issn_number: e.target.value })
                }
                margin="dense"
              />
              <TextField
                fullWidth
                label="Impact Factor"
                name="impact_factor"
                value={editData.impact_factor}
                onChange={(e) =>
                  setEditData({ ...editData, impact_factor: e.target.value })
                }
                margin="dense"
              />
              <TextField
                fullWidth
                label="Quarter"
                name="quarter"
                value={editData.quarter}
                onChange={(e) =>
                  setEditData({ ...editData, quarter: e.target.value })
                }
                margin="dense"
              />
              <TextField
                fullWidth
                label="Year"
                name="year"
                type="number"
                value={editData.year}
                onChange={(e) =>
                  setEditData({ ...editData, year: e.target.value })
                }
                margin="dense"
              />
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditOpen(false)} color="inherit">
            Cancel
          </Button>
          <Button onClick={handleEditSave} variant="contained" color="primary">
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert
          severity={snackbar.severity}
          variant="filled"
          onClose={() => setSnackbar({ ...snackbar, open: false })}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default T1ResearchList;
