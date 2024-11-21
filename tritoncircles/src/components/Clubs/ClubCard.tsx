import React from "react";
import { 
  Card, 
  CardMedia, 
  CardContent, 
  Typography, 
  IconButton, 
  Box, 
  Tooltip,
  CardActions,
  Button
} from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";

interface ClubCardProps {
  id: number;
  name: string;
  description: string;
  link: string;
  favorite: boolean;
  toggleFavorite: (id: number) => void;
}

const ClubCard: React.FC<ClubCardProps> = ({ 
  id, 
  name, 
  description, 
  link, 
  favorite, 
  toggleFavorite 
}) => {
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
      <CardMedia
        component="img"
        height="140"
        image={`https://via.placeholder.com/300x140?text=${encodeURIComponent(name)}`}
        alt={`${name} thumbnail`}
        sx={{
          objectFit: 'cover',
          backgroundColor: 'grey.200',
          transition: 'filter 0.2s ease-in-out',
          '&:hover': {
            filter: 'brightness(0.9)',
          },
        }}
      />
      
      <CardContent sx={{ flexGrow: 1, pb: 1 }}>
        <Box display="flex" justifyContent="space-between" alignItems="flex-start">
          <Typography 
            variant="h6" 
            component="h2"
            sx={{
              fontSize: '1.1rem',
              fontWeight: 600,
              mb: 1,
              lineHeight: 1.2,
              maxWidth: 'calc(100% - 48px)', // Account for the favorite icon
            }}
          >
            {name}
          </Typography>
          <Tooltip title={favorite ? "Remove from favorites" : "Add to favorites"}>
            <IconButton 
              onClick={handleFavoriteClick}
              sx={{
                color: favorite ? 'error.main' : 'action.disabled',
                transition: 'transform 0.2s ease-in-out',
                '&:hover': {
                  transform: 'scale(1.1)',
                },
              }}
              aria-label={favorite ? "Remove from favorites" : "Add to favorites"}
            >
              <FavoriteIcon />
            </IconButton>
          </Tooltip>
        </Box>
        
        <Typography 
          variant="body2" 
          color="text.secondary"
          sx={{
            mb: 2,
            display: '-webkit-box',
            overflow: 'hidden',
            WebkitBoxOrient: 'vertical',
            WebkitLineClamp: 3,
            lineHeight: 1.5,
            height: '4.5em', // Approximately 3 lines of text
          }}
        >
          {description}
        </Typography>
      </CardContent>

      <CardActions sx={{ p: 2, pt: 0 }}>
        <Button 
          component="a"
          href={link}
          target="_blank"
          rel="noopener noreferrer"
          endIcon={<OpenInNewIcon />}
          size="small"
          sx={{
            ml: 'auto',
            textTransform: 'none',
            '&:hover': {
              backgroundColor: 'action.hover',
            },
          }}
        >
          Visit Club Page
        </Button>
      </CardActions>
    </Card>
  );
};

export default ClubCard;