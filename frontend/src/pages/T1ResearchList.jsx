import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Typography,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Paper,
  CircularProgress,
  Container
} from "@mui/material";

const T1ResearchList = () => {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchSubmissions = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://127.0.0.1:8000/api/faculty/t1_1/", {
        headers: {
          Authorization: `Token ${token}`,
        },
      });
      setSubmissions(response.data);
    } catch (error) {
      console.error("Failed to fetch submissions:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubmissions();
  }, []);

  return (
    <Container maxWidth="lg" style={{ marginTop: "40px" }}>
      <Typography variant="h4" gutterBottom>
        My Submissions (T1.1)
      </Typography>
      {loading ? (
        <CircularProgress />
      ) : submissions.length === 0 ? (
        <Typography>No submissions found.</Typography>
      ) : (
        <Paper>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Title</TableCell>
                <TableCell>Journal</TableCell>
                <TableCell>Publication Date</TableCell>
                <TableCell>Quarter</TableCell>
                <TableCell>Year</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {submissions.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.title}</TableCell>
                  <TableCell>{item.journal_name}</TableCell>
                  <TableCell>{item.publication_date}</TableCell>
                  <TableCell>{item.quarter}</TableCell>
                  <TableCell>{item.year}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>
      )}
    </Container>
  );
};

export default T1ResearchList;
