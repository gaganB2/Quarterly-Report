import React from "react";
import {
  Box,
  Container,
  Grid,
  Card,
  CardActionArea,
  CardContent,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemText,
  Button,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

const modules = [
  { code: "T1.1", label: "Published Research Articles/Papers in Journals/Periodicals" },
  { code: "T1.2", label: "Paper Publications in Conferences" },
  { code: "T2.1", label: "FDP/STTP/Workshop Attended by Faculty" },
  { code: "T2.2", label: "FDP/STTP/Workshop Organized by Faculty" },
  { code: "T3.1", label: "Books/Monographs Published as Author/Co-Author" },
  { code: "T3.2", label: "Chapters in Edited Books/Reference Books" },
];

const guidelines = [
  "Do not fill data in the first sheet—use individual sheets only.",
  "Do not merge cells; follow the provided format exactly.",
  'If a field is not applicable, enter "Nil" or "NA", never leave it blank.',
  "Provide a unique link per document; don’t combine multiple docs into one PDF.",
  "Club heads for T7.1 email their data directly to enumerator@bitdurg.ac.in.",
  "Create department folders under the HOD’s email ID, with subfolders per table number.",
  "Submit your quarterly report by the 10th of the following month.",
];

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      {/* Hero Section */}
      <Paper
        elevation={3}
        sx={{
          p: 4,
          mb: 6,
          background: (theme) =>
            theme.palette.mode === "light"
              ? "linear-gradient(135deg, #e3f2fd 0%, #ffffff 100%)"
              : theme.palette.background.paper,
        }}
      >
        <Typography variant="h3" gutterBottom fontWeight={700}>
          BIT Durg Quarterly Reporting
        </Typography>
        <Typography variant="h6" gutterBottom color="text.secondary">
          Digitize your quarterly Excel/PDF submissions. Secure login for Faculty, HOD, and Admin.
        </Typography>
        <Box mt={2} display="flex" gap={2} flexWrap="wrap">
          <Button
            variant="contained"
            size="large"
            onClick={() => navigate("/login")}
          >
            Faculty / HOD Login
          </Button>
          <Button
            variant="outlined"
            size="large"
            onClick={() => navigate("/login")}
          >
            Admin Login
          </Button>
        </Box>
      </Paper>

      {/* Modules Grid */}
      <Typography variant="h4" gutterBottom fontWeight={600}>
        Reporting Sections
      </Typography>
      <Grid container spacing={3} mb={6}>
        {modules.map(({ code, label }) => (
          <Grid item xs={12} sm={6} md={4} key={code}>
            <Card
              elevation={2}
              sx={{
                height: "100%",
                transition: "transform 0.2s, box-shadow 0.2s",
                "&:hover": {
                  transform: "translateY(-4px)",
                  boxShadow: 6,
                },
              }}
            >
              <CardActionArea onClick={() => navigate("/login")}>
                <CardContent>
                  <Typography variant="h6" fontWeight={600}>
                    {code}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {label}
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Guidelines */}
      <Typography variant="h4" gutterBottom fontWeight={600}>
        Important Guidelines
      </Typography>
      <Paper elevation={1} sx={{ p: 3 }}>
        <List>
          {guidelines.map((text, i) => (
            <ListItem key={i} sx={{ display: "list-item", pl: 2 }}>
              <ListItemText primary={text} />
            </ListItem>
          ))}
        </List>
      </Paper>
    </Container>
  );
}
