import * as React from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { pink } from '@mui/material/colors';

interface ClubProps {
  id: number;
  name: string;
  description: string;
  favorite: boolean;
  image: string;
  toggleFavorite: (id: number) => void;
}

export default function ClubCard({ id, name, description, favorite, image, toggleFavorite }: ClubProps) {
  return (
    <Card sx={{ maxWidth: 345, borderRadius: 2, boxShadow: 3 }}>
      <CardMedia
        sx={{ height: 180 }}
        image={image}
        title={name}
      />
      <CardContent>
        <Typography gutterBottom variant="h6" component="div">
          <b>{name}</b>
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {description}
        </Typography>
      </CardContent>
      <CardActions>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
          <IconButton aria-label="add to favorites" onClick={() => toggleFavorite(id)}>
            <FavoriteIcon sx={{ color: favorite ? pink[500] : "action" }} />
          </IconButton>
        </Box>
      </CardActions>
    </Card>
  );
}
