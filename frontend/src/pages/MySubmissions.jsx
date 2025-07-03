// MySubmissions page
import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  CircularProgress,
} from "@mui/material";
import axios from "axios";

const MySubmissions = () => {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          "http://127.0.0.1:8000/api/faculty/t1_1/",
          {
            headers: {
              Authorization: `Token ${token}`,
            },
          }
        );
        setSubmissions(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch submissions:", error);
        setLoading(false);
      }
    };

    fetchSubmissions();
  }, []);

  if (loading) {
    return (
      <Box mt={4} textAlign="center">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box mt={4} px={4}>
      <Typography variant="h5" gutterBottom>
        My Submitted T1.1 Research Articles
      </Typography>
      <Paper>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Title</TableCell>
              <TableCell>Journal</TableCell>
              <TableCell>Publication Date</TableCell>
              <TableCell>Impact Factor</TableCell>
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
                <TableCell>{item.impact_factor}</TableCell>
                <TableCell>{item.quarter}</TableCell>
                <TableCell>{item.year}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </Box>
  );
};

export default MySubmissions;
