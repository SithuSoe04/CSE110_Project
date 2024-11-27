import * as React from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import Box from '@mui/material/Box';
import FavoriteIcon from '@mui/icons-material/Favorite';
import IconButton from '@mui/material/IconButton';
import { pink } from '@mui/material/colors';
import Avatar from '@mui/material/Avatar';
import AvatarGroup from '@mui/material/AvatarGroup';

interface EventProps {
    id: number,
    club: string,
    title: string,
    date: string,
    room: string, 
    favorite: boolean,
    incentives: string[],
    toggleFavorite: (id: number) => void,
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString);

  // Format the date part as "Month Day, Year"
  const formattedDate = date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short', 
    day: 'numeric',
  });

  const options: Intl.DateTimeFormatOptions = {
    hour: 'numeric',
    minute: 'numeric',
    hour12: true, 
  };
  
  const formattedTime = date.toLocaleTimeString('en-US', options);

  // Combine both formatted date and time
  return `${formattedDate}, ${formattedTime}`;
};

export default function EventCard(event: EventProps) {
  return (
    <Card sx={{ maxWidth: 345, borderRadius: 2 }}>
      <CardMedia
        sx={{ height: 140 }}
        image="https://www.screenskills.com/media/6780/software_engineer.png?width=560&mode=crop&scale=both&center=0,0"
        title=""
      />
      <CardContent>
        <Typography gutterBottom variant="h6" component="div">
         <b>{event.title}</b>
        </Typography>
        <Typography gutterBottom variant="body2">
            {formatDate(event.date)}
        </Typography>
        <Typography variant="body2">
           {event.room}
        </Typography>
      </CardContent>
      <CardActions>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%'}}>
        <Box sx={{ display: 'flex', justifyContent:'flex-start'}}>
        <AvatarGroup spacing="medium" total={8} slotProps={{additionalAvatar: { sx: { width: 24, height: 24} }}}>
                <Avatar alt="Remy Sharp" src="/static/images/avatar/1.jpg" sx={{ width: 24, height: 24 }}/>
                <Avatar alt="Travis Howard" src="/static/images/avatar/2.jpg" sx={{ width: 24, height: 24 }}/>
                <Avatar alt="Agnes Walker" src="/static/images/avatar/4.jpg" sx={{ width: 24, height: 24 }}/>
                <Avatar alt="Trevor Henderson" src="/static/images/avatar/5.jpg" sx={{ width: 24, height: 24 }}/>
            </AvatarGroup>
        </Box>
        <Box sx={{ display: 'flex', justifyContent:'flex-end', alignItems:'center', gap: '0.25rem' }}>
            <Chip label={event.club} color="secondary" size="small" />
            {/* {event.incentives.map(incentive=>(
              <Chip label={incentive} color="primary" size="small" />
            ))} */}
            <IconButton aria-label="add to favorites" onClick={() => event.toggleFavorite(event.id)}>
            <FavoriteIcon sx={{color: event.favorite ? pink[500] : "action"}}/>
            </IconButton>
        </Box>
      </Box>
      </CardActions>
    </Card>
  );
}