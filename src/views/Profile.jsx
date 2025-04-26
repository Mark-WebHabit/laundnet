import React, { useContext, useEffect, useState } from "react";
import {
  TextField,
  Checkbox,
  FormControlLabel,
  Button,
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import { DataContext } from "../context/DataStore";
import { db } from "../../firebase";
import { get, ref, update } from "firebase/database";

const apiKey = import.meta.env.VITE_GMAP;
function Profile() {
  const [changePassword, setChangePassword] = useState(false);
  const [currentUser, setCurrentUser] = useState({});
  const [formData, setFormData] = useState({
    username: "",
    address: "",
    phone: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const { user } = useContext(DataContext);

  useEffect(() => {
    if (user) {
      const userRef = ref(db, `users/${user?.uid}`);

      get(userRef).then((snapshot) => {
        if (snapshot.val()) {
          const userData = snapshot.val();
          setCurrentUser(userData);
          setFormData({
            username: userData.username || "",
            address: userData.address || "",
            phone: userData.phone || "",
          });
        }
      });
    }
  }, [user]);

  const handleCheckboxChange = (event) => {
    setChangePassword(event.target.checked);
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const validateForm = async () => {
    let formErrors = {};

    // Validate phone number
    const phoneRegex = /^09\d{9}$/;
    if (!phoneRegex.test(formData.phone)) {
      formErrors.phone =
        "Phone number must start with 09 and be 11 digits long.";
    }

    setErrors(formErrors);
    return Object.keys(formErrors).length === 0;
  };

  const handleConfirmLocation = () => {
    setFormData({
      ...formData,
    });
    setShowMapModal(false);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const isValid = await validateForm();
    if (!isValid) return;

    update(ref(db, `users/${user.uid}`), {
      username: formData.username,
      address: formData.address,
      phone: formData.phone,
    })
      .then(() => alert("Profile updated successfully"))
      .catch((error) => alert(error.message));
  };

  return (
    <Box
      component="form"
      className="flex-1 w-full"
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 2,
        maxWidth: 600,
        margin: "auto",
      }}
      onSubmit={handleSubmit}
    >
      <TextField
        label="Username"
        variant="outlined"
        required
        name="username"
        value={formData.username}
        onChange={handleInputChange}
      />
      <TextField
        label="Address"
        variant="outlined"
        required
        name="address"
        value={formData.address}
        onChange={handleInputChange}
      />

      <TextField
        label="Phone"
        variant="outlined"
        required
        name="phone"
        value={formData.phone}
        onChange={handleInputChange}
      />

      <FormControlLabel
        control={
          <Checkbox checked={changePassword} onChange={handleCheckboxChange} />
        }
        label="Change Password"
      />

      {changePassword && (
        <>
          <TextField
            label="Current Password"
            type="password"
            variant="outlined"
            required
            name="currentPassword"
            value={formData.currentPassword}
            onChange={handleInputChange}
          />
          <TextField
            label="New Password"
            type="password"
            variant="outlined"
            required
            name="newPassword"
            value={formData.newPassword}
            onChange={handleInputChange}
          />
          <TextField
            label="Confirm New Password"
            type="password"
            variant="outlined"
            required
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleInputChange}
          />
        </>
      )}

      <Button variant="contained" color="primary" type="submit">
        Save
      </Button>
    </Box>
  );
}

export default Profile;
