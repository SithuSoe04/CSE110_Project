import React, { useState } from "react";
import ClubCard from "../components/Clubs/ClubCard";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import { Typography, TextField } from "@mui/material";
import { Link } from "react-router-dom";

const Clubs = () => {
  const initialClubData = [
    {
      id: 1,
      name: "Art Club",
      description: "A place for artists to connect and create.",
      favorite: false,
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRdwOclMIU1bV1ovTh9xt31uoGasTbK7gskLg&s",
    },
    {
      id: 2,
      name: "Robotics Club",
      description: "Build and program robots.",
      favorite: false,
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQn5IHPvRSgaFDryNPGcTjCEkOEx_P_P-jDTQ&shttps://via.placeholder.com/300?text=Robotics+Club",
    },
    {
      id: 3,
      name: "Chess Club",
      description: "Chess enthusiasts meet here!",
      favorite: true,
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS8r4dsIXKKsS_Vj0gIJ5oXVkNcfL09BshBEQ&s",
    },
    {
      id: 4,
      name: "Cooking Club",
      description: "Learn and share recipes.",
      favorite: false,
      image: "https://www.eatright.org/-/media/images/eatright-articles/eatright-main-featured---804x482px/learntocookathome_804x482.jpg?as=0&w=967&rev=ba2d868e41744f6c93dd5ed8c20a1361&hash=FF721326448D5B22E329D6022301F57B",
    },
    {
      id: 5,
      name: "Photography Club",
      description: "Capture moments together.",
      favorite: true,
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS9SfQI0L_lI2LHZ9OdqAqwo9RR8tsuZ5DuIQ&s",
    },
  ];

  const [clubData, setClubData] = useState(initialClubData);
  const [searchQuery, setSearchQuery] = useState("");

  const toggleFavorite = (id: number) => {
    setClubData((prevData) =>
      prevData.map((club) =>
        club.id === id ? { ...club, favorite: !club.favorite } : club
      )
    );
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const filteredClubs = clubData.filter((club) =>
    club.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const favoriteClubs = filteredClubs.filter((club) => club.favorite);
  const otherClubs = filteredClubs.filter((club) => !club.favorite);

  return (
    <Box sx={{ flexGrow: 1, margin: "3rem" }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Typography gutterBottom variant="h4">
          <Box sx={{ fontWeight: "bold" }}>Clubs</Box>
        </Typography>
        <TextField
          label="Search Clubs"
          variant="outlined"
          value={searchQuery}
          onChange={handleSearchChange}
          sx={{ width: 300 }}
        />
      </Box>

      <Typography gutterBottom variant="h5">
        <Box sx={{ fontWeight: "bold" }}>Favorite Clubs</Box>
      </Typography>
      <Grid container spacing={2} mb={5}>
        {favoriteClubs.map((club) => (
          <Grid key={club.id} item xs={12} sm={6} md={4} lg={3}>
            <Link to={`/club/${club.id}`} style={{ textDecoration: 'none' }}>
              <ClubCard
                id={club.id}
                name={club.name}
                description={club.description}
                favorite={club.favorite}
                image={club.image}
                toggleFavorite={toggleFavorite}
              />
            </Link>
          </Grid>
        ))}
      </Grid>

      <Typography gutterBottom variant="h5">
        <Box sx={{ fontWeight: "bold" }}>Other Clubs</Box>
      </Typography>
      <Grid container spacing={2}>
        {otherClubs.map((club) => (
          <Grid key={club.id} item xs={12} sm={6} md={4} lg={3}>
            <Link to={`/club/${club.id}`} style={{ textDecoration: 'none' }}>
              <ClubCard
                id={club.id}
                name={club.name}
                description={club.description}
                favorite={club.favorite}
                image={club.image}
                toggleFavorite={toggleFavorite}
              />
            </Link>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default Clubs;
