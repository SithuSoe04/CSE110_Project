import React from "react";
import { Card, CardMedia, CardContent, Typography, IconButton, Box } from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { Link } from "react-router-dom";

interface ClubCardProps {
  id: number;
  name: string;
  description: string;
  favorite: boolean;
  image: string;
  toggleFavorite: (id: number) => void;
}

const ClubCard: React.FC<ClubCardProps> = ({ id, name, description, favorite, image, toggleFavorite }) => {
  const handleFavoriteClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation(); // Prevents the click event from bubbling up to the link
    e.preventDefault(); // Prevents the default action, which is navigation
    toggleFavorite(id);
  };

  return (
    <Card>
      <Link to={`/clubs/${id}`} style={{ textDecoration: "none", color: "inherit" }}>
        <CardMedia component="img" height="140" image={image} alt={name} />
      </Link>
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Box>
            <Typography variant="h6" component="div">
              {name}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {description}
            </Typography>
          </Box>
          <IconButton
            aria-label="add to favorites"
            onClick={handleFavoriteClick} // Attach the click handler here
            color={favorite ? "error" : "default"}
          >
            <FavoriteIcon />
          </IconButton>
        </Box>
      </CardContent>
    </Card>
  );
};

export default ClubCard;
