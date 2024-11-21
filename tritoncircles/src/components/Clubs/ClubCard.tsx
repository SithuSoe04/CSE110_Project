import React from "react";
import { Card, CardMedia, CardContent, Typography, IconButton, Box, Tooltip } from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";

interface ClubCardProps {
  id: number;
  name: string;
  description: string;
  link: string;
  favorite: boolean;
  toggleFavorite: (id: number) => void;
}

const ClubCard: React.FC<ClubCardProps> = ({ id, name, description, link, favorite, toggleFavorite }) => {
  const handleFavoriteClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    e.preventDefault();
    toggleFavorite(id);
  };

  return (
    <Card 
      sx={{ 
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: (theme) => theme.shadows[4],
        },
      }}
    >
      <a 
        href={link} 
        target="_blank" 
        rel="noopener noreferrer" 
        style={{ textDecoration: "none" }}
      >
        <CardMedia 
          component="img" 
          height="140" 
          image={`https://via.placeholder.com/300?text=${encodeURIComponent(name)}`} 
          alt={`${name} club thumbnail`}
          sx={{
            transition: 'filter 0.2s ease-in-out',
            '&:hover': {
              filter: 'brightness(0.9)',
            },
          }}
        />
      </a>
      <CardContent sx={{ flexGrow: 1, p: 2 }}>
        <Box display="flex" justifyContent="space-between" alignItems="flex-start">
          <Box sx={{ flex: 1, mr: 2 }}>
            <Typography 
              variant="h6" 
              component="h2" 
              gutterBottom
              sx={{
                fontSize: '1.1rem',
                fontWeight: 600,
                lineHeight: 1.2,
                mb: 1,
              }}
            >
              {name}
            </Typography>
            <Typography 
              variant="body2" 
              color="text.secondary"
              sx={{
                display: '-webkit-box',
                overflow: 'hidden',
                WebkitBoxOrient: 'vertical',
                WebkitLineClamp: 3,
                lineHeight: 1.5,
              }}
            >
              {description}
            </Typography>
          </Box>
          <Tooltip title={favorite ? "Remove from favorites" : "Add to favorites"}>
            <IconButton 
              onClick={handleFavoriteClick} 
              color={favorite ? "error" : "default"}
              aria-label={favorite ? "Remove from favorites" : "Add to favorites"}
              sx={{
                transition: 'transform 0.2s ease-in-out',
                '&:hover': {
                  transform: 'scale(1.1)',
                },
              }}
            >
              <FavoriteIcon />
            </IconButton>
          </Tooltip>
        </Box>
        <Box mt={2}>
          <Typography 
            component="a"
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            color="primary"
            sx={{ 
              textDecoration: 'none',
              fontSize: '0.875rem',
              fontWeight: 500,
              display: 'inline-flex',
              alignItems: 'center',
              '&:hover': {
                textDecoration: 'underline',
              },
            }}
          >
            Visit Club Page →
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export default ClubCard;