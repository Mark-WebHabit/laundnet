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
  const [showMapModal, setShowMapModal] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    address: "",
    phone: "",
    latitude: "",
    longitude: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const { user } = useContext(DataContext);
  const [tempLocation, setTempLocation] = useState({
    latitude: "",
    longitude: "",
  });

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
            latitude: userData.latitude || "",
            longitude: userData.longitude || "",
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

  const fetchCoordinates = async () => {
    const address = formData.address;
    if (!address) {
      alert("Please enter an address.");
      return;
    }

    const geocodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
      address
    )}&key=${apiKey}`;

    try {
      const response = await fetch(geocodeUrl);
      const data = await response.json();

      if (data.status === "OK") {
        const location = data.results[0].geometry.location;
        setTempLocation({ latitude: location.lat, longitude: location.lng });
        setShowMapModal(true);
      } else {
        alert("Address not found. Please try again.");
      }
    } catch (error) {
      console.error("Error fetching coordinates:", error);
      alert("Failed to fetch location. Try again later.");
    }
  };

  const handleConfirmLocation = () => {
    setFormData({
      ...formData,
      latitude: tempLocation.latitude,
      longitude: tempLocation.longitude,
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
      latitude: formData.latitude,
      longitude: formData.longitude,
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
      <Button variant="contained" color="secondary" onClick={fetchCoordinates}>
        Validate Address
      </Button>
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

      {/* Map Confirmation Modal */}
      <Dialog open={showMapModal} onClose={() => setShowMapModal(false)}>
        <DialogTitle>Confirm Address Location</DialogTitle>
        <DialogContent>
          <iframe
            width="100%"
            height="300"
            frameBorder="0"
            src={`https://www.google.com/maps/embed/v1/place?key=${apiKey}&q=${tempLocation.latitude},${tempLocation.longitude}`}
            allowFullScreen
          ></iframe>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowMapModal(false)} color="secondary">
            Retry
          </Button>
          <Button onClick={handleConfirmLocation} color="primary">
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default Profile;
