import React, { useState, useEffect } from "react";
import ClubCard from "../components/Clubs/ClubCard";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";
import Alert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";
import axios from "axios";

interface Club {
  club_id: number;
  name: string;
  description: string;
  link: string;
  favorite: boolean;
}

const Clubs = () => {
  const [clubs, setClubs] = useState<Club[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: "" });

  useEffect(() => {
    const fetchClubs = async () => {
      try {
        setLoading(true);
        console.log("Fetching clubs...");
        
        const response = await axios.get("http://localhost:8080/api/clubs");
        console.log("Raw response:", response.data);

        if (!response.data || !response.data.clubs) {
          throw new Error("Invalid data format received from server");
        }

        const initialClubs = response.data.clubs.map((club: any) => ({
          ...club,
          favorite: Boolean(club.favorite)
        }));

        console.log("Processed clubs:", initialClubs);
        setClubs(initialClubs);
        setError(null);
      } catch (err) {
        console.error("Error details:", err);
        setError(err instanceof Error ? err.message : "Failed to load clubs");
      } finally {
        setLoading(false);
      }
    };

    fetchClubs();
  }, []);

  const handleToggleFavorite = async (clubId: number) => {
    try {
      console.log("Attempting to toggle favorite for club:", clubId);
      
      const response = await axios.post(
        "http://localhost:8080/api/clubs/favorite",
        {
          userId: 1,
          clubId: clubId
        },
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      console.log("Toggle response:", response.data);

      if (response.data.success) {
        setClubs(prevClubs => 
          prevClubs.map(club => 
            club.club_id === clubId 
              ? { ...club, favorite: !club.favorite }
              : club
          )
        );
        
        setSnackbar({
          open: true,
          message: response.data.message || "Updated favorite status"
        });
      } else {
        throw new Error(response.data.error || "Failed to update favorite status");
      }
    } catch (err) {
      console.error("Error toggling favorite:", err);
      let errorMessage = "Failed to update favorite status";
      
      if (axios.isAxiosError(err) && err.response) {
        errorMessage = err.response.data.error || errorMessage;
      }

      setSnackbar({
        open: true,
        message: errorMessage
      });
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ margin: "3rem" }}>
        <Alert severity="error">
          {error}
          <br />
          <Typography variant="body2" sx={{ mt: 1 }}>
            Please check the console for more details.
          </Typography>
        </Alert>
      </Box>
    );
  }

  const favoriteClubs = clubs.filter(club => club.favorite);
  const otherClubs = clubs.filter(club => !club.favorite);

  return (
    <Box sx={{ flexGrow: 1, margin: "3rem" }}>
      <Typography gutterBottom variant="h4">
        <Box sx={{ fontWeight: "bold" }}>Favorite Clubs</Box>
      </Typography>
      <Grid container spacing={2} mb={5}>
        {favoriteClubs.map((club) => (
          <Grid key={club.club_id} item xs={12} sm={6} md={4} lg={3}>
            <ClubCard
              id={club.club_id}
              name={club.name}
              description={club.description}
              link={club.link}
              favorite={club.favorite}
              toggleFavorite={handleToggleFavorite}
            />
          </Grid>
        ))}
      </Grid>

      <Typography gutterBottom variant="h4">
        <Box sx={{ fontWeight: "bold" }}>Other Clubs</Box>
      </Typography>
      <Grid container spacing={2}>
        {otherClubs.map((club) => (
          <Grid key={club.club_id} item xs={12} sm={6} md={4} lg={3}>
            <ClubCard
              id={club.club_id}
              name={club.name}
              description={club.description}
              link={club.link}
              favorite={club.favorite}
              toggleFavorite={handleToggleFavorite}
            />
          </Grid>
        ))}
      </Grid>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        message={snackbar.message}
      />
    </Box>
  );
};

export default Clubs;