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
} from "@mui/material";
import { Delete } from "@mui/icons-material";
import axios from "axios";

const T1ResearchList = () => {
  const [articles, setArticles] = useState([]);
  const [filteredArticles, setFilteredArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [deleteId, setDeleteId] = useState(null);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const token = localStorage.getItem("token");

  const fetchData = () => {
    setLoading(true);
    axios
      .get("http://127.0.0.1:8000/api/faculty/t1research/", {
        headers: { Authorization: `Token ${token}` },
      })
      .then((res) => {
        setArticles(res.data);
        setFilteredArticles(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load submissions", err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchData();
  }, [token]);

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    const filtered = articles.filter(
      (article) =>
        article.title.toLowerCase().includes(query) ||
        article.journal_name.toLowerCase().includes(query)
    );
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

      <TextField
        fullWidth
        label="Search by Title or Journal"
        value={searchQuery}
        onChange={handleSearch}
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
                  <TableCell align="center">
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
      <Dialog
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
      >
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
    </Container>
  );
};

export default T1ResearchList;
