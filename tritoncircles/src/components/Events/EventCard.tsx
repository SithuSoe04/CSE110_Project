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
    title: string,
    date: string,
    room: string, 
}

export default function EventCard(event: EventProps) {
  const [interested, setInterested] = React.useState(false);
  const handleClick = () => {
    setInterested(!interested);
  };
  return (
    <Card sx={{ maxWidth: 345, borderRadius: 2 }}>
      <CardMedia
        sx={{ height: 140 }}
        image="https://www.screenskills.com/media/6780/software_engineer.png?width=560&mode=crop&scale=both&center=0,0"
        title="green iguana"
      />
      <CardContent>
        <Typography gutterBottom variant="h6" component="div">
         <b>Software Engineering 101</b>
        </Typography>
        <Typography gutterBottom variant="body2">
          Nov 27, 6:00 - 7:30 PM
        </Typography>
        <Typography variant="body2">
          CSE1202
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
            <Chip label="CSES" color="secondary" size="small" />
            <Chip label="Food" color="primary" size="small" />
            <IconButton aria-label="add to favorites" onClick={handleClick}>
            <FavoriteIcon sx={{color: interested ? pink[500] : "action"}}/>
            </IconButton>
        </Box>
      </Box>
      </CardActions>
    </Card>
  );
}