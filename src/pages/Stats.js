import React, { useEffect, useState } from "react";
import axios from "axios";
import { Box, Paper, Typography, Grid } from "@mui/material";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

const Stats = () => {
  const [employees, setEmployees] = useState([]);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/employees");
        setEmployees(res.data);
      } catch (err) {
        console.error("Veriler alınamadı:", err);
      }
    };

    fetchEmployees();
  }, []);

  const totalEmployees = employees.length;
  const totalSalary = employees.reduce(
    (sum, emp) => sum + Number(emp.salary),
    0
  );
  const averageSalary = totalEmployees
    ? Math.round(totalSalary / totalEmployees)
    : 0;
  const departmentCount = new Set(employees.map((emp) => emp.department)).size;
  const minSalary = employees.length
    ? Math.min(...employees.map((emp) => Number(emp.salary)))
    : 0;
  const maxSalary = employees.length
    ? Math.max(...employees.map((emp) => Number(emp.salary)))
    : 0;

  const departmentCounts = employees.reduce((acc, emp) => {
    acc[emp.department] = (acc[emp.department] || 0) + 1;
    return acc;
  }, {});

  const stats = [
    { title: "Toplam Çalışan", value: totalEmployees, color: "#1976d2" },
    {
      title: "Ortalama Maaş",
      value: `${averageSalary.toLocaleString()} ₺`,
      color: "#2e7d32",
    },
    { title: "Departman Sayısı", value: departmentCount, color: "#ed6c02" },
    {
      title: "En Yüksek Maaş",
      value: `${maxSalary.toLocaleString()} ₺`,
      color: "#d32f2f",
    },
    {
      title: "Toplam Maaş Ödemesi",
      value: `${totalSalary.toLocaleString()} ₺`,
      color: "#6a1b9a",
    },
    {
      title: "En Düşük Maaş",
      value: `${minSalary.toLocaleString()} ₺`,
      color: "#00897b",
    },
  ];

  const deptEmployeeData = Object.entries(departmentCounts).map(
    ([dept, count]) => ({
      name: dept,
      value: count,
    })
  );

  const deptSalaryData = Object.entries(departmentCounts).map(([dept]) => {
    const deptEmps = employees.filter((emp) => emp.department === dept);
    const totalDeptSalary = deptEmps.reduce(
      (sum, emp) => sum + Number(emp.salary),
      0
    );
    return {
      name: dept,
      value: totalDeptSalary,
    };
  });

  const salaryRangeData = [
    { range: "0-10K", count: employees.filter((e) => e.salary < 10000).length },
    {
      range: "10K-25K",
      count: employees.filter((e) => e.salary >= 10000 && e.salary < 25000)
        .length,
    },
    {
      range: "25K-50K",
      count: employees.filter((e) => e.salary >= 25000 && e.salary < 50000)
        .length,
    },
    { range: "50K+", count: employees.filter((e) => e.salary >= 50000).length },
  ];

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#AF19FF"];

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        İstatistikler
      </Typography>

      {/* Kartlar */}
      <Grid container spacing={2} mt={2}>
        {stats.map((item, i) => (
          <Grid item xs={12} sm={6} md={4} lg={2} key={i}>
            <Paper
              elevation={3}
              sx={{
                p: 2,
                textAlign: "center",
                borderRadius: 2,
                backgroundColor: "white",
                color: "black",
              }}
            >
              <Typography variant="subtitle2">{item.title}</Typography>
              <Typography variant="h5" fontWeight="bold">
                {item.value}
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>

      <Box>
        {/* Grafik 1 ve 2 */}
        <Grid container spacing={3} mt={5}>
          <Grid item xs={12} md={6}>
            <Typography variant="h6" gutterBottom>
              📌 Departman Bazlı Çalışan Sayısı
            </Typography>
            <Box sx={{ width: "100%", minWidth: 570, height: 550 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={deptEmployeeData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="name"
                    interval={0} // tüm label'ları zorla göster
                    tick={{ fontSize: 12 }}
                  />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#1976d2" />
                </BarChart>
              </ResponsiveContainer>
            </Box>
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography variant="h6" gutterBottom>
              📌 Departmanlara Göre Toplam Maaş
            </Typography>
            <Box sx={{ width: "100%", minWidth: 550, height: 550 }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={deptSalaryData}
                    dataKey="value"
                    nameKey="name"
                    outerRadius={120}
                    label
                  >
                    {deptSalaryData.map((_, index) => (
                      <Cell key={index} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </Box>
          </Grid>
        </Grid>

        <Grid container spacing={3} mt={5}>
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom>
              📌 Maaş Aralığına Göre Çalışan Sayısı
            </Typography>
            <Box sx={{ width: "100%", minWidth: 550, height: 550 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={salaryRangeData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="range" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#9c27b0" />
                </BarChart>
              </ResponsiveContainer>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default Stats;
