import React, { useEffect, useState } from "react";
import {
  Box,
  Grid,
  Card,
  Typography,
  Button,
  CircularProgress,
  useTheme,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import {
  Article,
  CalendarMonth,
  CalendarToday,
  Add,
  Logout,
} from "@mui/icons-material";

const GlassCard = styled(Card)(({ theme }) => ({
  padding: theme.spacing(2),
  background: "rgba(255, 255, 255, 0.3)",
  backdropFilter: "blur(10px)",
  borderRadius: theme.spacing(2),
  boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.37)",
}));

const Dashboard = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const username = localStorage.getItem("username") || "Faculty";

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({
    by_quarter: [],
    by_department: [],
    by_year: [],
  });

  useEffect(() => {
    axios
      .get("http://localhost:8000/api/faculty/t1research/metrics/", {
        headers: { Authorization: `Token ${localStorage.getItem("token")}` },
      })
      .then((res) => setData(res.data))
      .catch((err) => console.error("Dashboard metrics fetch error:", err))
      .finally(() => setLoading(false));
  }, []);

  const COLORS = ["#1e88e5", "#43a047", "#fbc02d", "#e53935", "#8e24aa"];

  const totalSubmissions = data.by_quarter.reduce(
    (sum, item) => sum + item.count,
    0
  );

  return (
    <Box sx={{ p: 3 }}>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={4}
        flexWrap="wrap"
      >
        <Box>
          <Typography variant="h4" fontWeight={700}>
            Hello, {username}!
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            Your submission overview & analytics
          </Typography>
        </Box>
        <Box display="flex" gap={2} mt={{ xs: 2, sm: 0 }}>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => navigate("/submit-t1")}
          >
            + New Submission
          </Button>
          <Button
            variant="outlined"
            color="error"
            startIcon={<Logout />}
            onClick={() => {
              localStorage.removeItem("token");
              navigate("/login");
            }}
          >
            Logout
          </Button>
        </Box>
      </Box>

      {loading ? (
        <Box textAlign="center" mt={6}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          <Grid container spacing={3} mb={4}>
            <Grid item xs={12} sm={4}>
              <GlassCard>
                <Box display="flex" alignItems="center" gap={2}>
                  <Article color="primary" />
                  <Box>
                    <Typography variant="h6" fontWeight={600}>
                      {totalSubmissions}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Total Submissions
                    </Typography>
                  </Box>
                </Box>
              </GlassCard>
            </Grid>
            <Grid item xs={12} sm={4}>
              <GlassCard>
                <Box display="flex" alignItems="center" gap={2}>
                  <CalendarMonth color="success" />
                  <Box>
                    <Typography variant="h6" fontWeight={600}>
                      {data.by_quarter.length}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Quarter (≘)
                    </Typography>
                  </Box>
                </Box>
              </GlassCard>
            </Grid>
            <Grid item xs={12} sm={4}>
              <GlassCard>
                <Box display="flex" alignItems="center" gap={2}>
                  <CalendarToday color="action" />
                  <Box>
                    <Typography variant="h6" fontWeight={600}>
                      {data.by_year.length}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Year (↗)
                    </Typography>
                  </Box>
                </Box>
              </GlassCard>
            </Grid>
          </Grid>

          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <GlassCard>
                <Typography variant="subtitle1" fontWeight={600} mb={1}>
                  By Quarter
                </Typography>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={data.by_quarter}>
                    <XAxis dataKey="quarter" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill="#1e88e5" />
                  </BarChart>
                </ResponsiveContainer>
              </GlassCard>
            </Grid>

            <Grid item xs={12} md={4}>
              <GlassCard>
                <Typography variant="subtitle1" fontWeight={600} mb={1}>
                  By Department
                </Typography>
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie
                      data={data.by_department}
                      dataKey="count"
                      nameKey="department"
                      cx="50%"
                      cy="50%"
                      outerRadius={70}
                      fill="#8884d8"
                      label
                    >
                      {data.by_department.map((_, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </GlassCard>
            </Grid>

            <Grid item xs={12} md={4}>
              <GlassCard>
                <Typography variant="subtitle1" fontWeight={600} mb={1}>
                  Over Years
                </Typography>
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={data.by_year}>
                    <XAxis dataKey="year" />
                    <YAxis />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="count"
                      stroke="#43a047"
                      strokeWidth={2}
                      dot={{ r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </GlassCard>
            </Grid>
          </Grid>
        </>
      )}
    </Box>
  );
};

export default Dashboard;
