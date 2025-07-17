import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import {
  Typography,
  Box,
  Paper,
  TextField,
  Button,
  Stack,
} from "@mui/material";

const EmployeeDetail = () => {
  const { id } = useParams();
  const [employee, setEmployee] = useState(null);
  const [form, setForm] = useState({
    name: "",
    position: "",
    department: "",
    salary: "",
  });

  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/employees/${id}`
        );
        setEmployee(res.data);
        setForm({
          name: res.data.name,
          position: res.data.position,
          department: res.data.department,
          salary: res.data.salary,
        });
      } catch (err) {
        console.error("detay alınamadı: ", err);
      }
    };

    fetchEmployee();
  }, [id]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleUpdate = async () => {
    try {
      await axios.put(`http://localhost:5000/api/employees/${id}`, form);
      alert("Çalışan bilgileri güncellendi.");
    } catch (err) {
      console.error("Güncelleme başarısız:", err);
    }
  };

  if (!employee) return <p>Loading...</p>;

  return (
    <Box display="flex" justifyContent="center" mt={5}>
      <Paper elevation={3} sx={{ p: 4, width: "100%", maxWidth: 500 }}>
        <Typography variant="h5" gutterBottom align="center">
          Employee Detail
        </Typography>
        <Stack spacing={2}>
          <TextField
            label="Ad Soyad"
            name="name"
            value={form.name}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            label="Pozisyon"
            name="position"
            value={form.position}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            label="Departman"
            name="department"
            value={form.department}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            label="Maaş"
            name="salary"
            type="number"
            value={form.salary}
            onChange={handleChange}
            fullWidth
          />
          <Button variant="contained" color="primary" onClick={handleUpdate}>
            Güncelle
          </Button>
        </Stack>
      </Paper>
    </Box>
  );
};

export default EmployeeDetail;
