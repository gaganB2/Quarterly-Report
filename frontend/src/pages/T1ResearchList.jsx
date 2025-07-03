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
} from "@mui/material";
import axios from "axios";

const T1ResearchList = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/api/faculty/t1research/", {
        headers: { Authorization: `Token ${token}` },
      })
      .then((res) => {
        setArticles(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load submissions", err);
        setLoading(false);
      });
  }, [token]);

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
      {articles.length === 0 ? (
        <Typography>No submissions found.</Typography>
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
              </TableRow>
            </TableHead>
            <TableBody>
              {articles.map((article) => (
                <TableRow key={article.id}>
                  <TableCell>{article.title}</TableCell>
                  <TableCell>{article.journal_name}</TableCell>
                  <TableCell>{article.issn_number}</TableCell>
                  <TableCell>{article.impact_factor}</TableCell>
                  <TableCell>{article.quarter}</TableCell>
                  <TableCell>{article.year}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Container>
  );
};

export default T1ResearchList;
