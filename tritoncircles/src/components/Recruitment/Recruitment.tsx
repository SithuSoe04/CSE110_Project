import * as React from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';

interface RecruitmentProps {
  id: number,
  club: string,
  position: string,
  date_posted: string,
  deadline: string,
  application_link: string,
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short', 
      day: 'numeric',
  });
};

const getRandomColor = () => {
  const r = Math.floor(Math.random() * 156) + 100; 
  const g = Math.floor(Math.random() * 156) + 100; 
  const b = Math.floor(Math.random() * 156) + 100; 
  return `rgb(${r}, ${g}, ${b})`;
};

export default function Recruitment(recruitment: RecruitmentProps) {
  const bgColor = getRandomColor();
  return (
    <Card sx={{ minWidth: 275, minHeight: 275, backgroundColor: bgColor}}>
      <CardContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent:'space-between', alignItems:'center', height: '250px' }}>
            <Box sx={{ display: 'flex', justifyContent:'space-between', alignItems:'center', width: '100%' }}>
                <Chip label={formatDate(recruitment.date_posted)} variant="outlined" size="medium" sx={{backgroundColor: 'white'}}/>
                <Chip label={recruitment.club} color="secondary" size="small" />
            </Box>
            <Typography variant="h4">
                <Box sx={{fontWeight: "bold"}}>{recruitment.position}</Box>
            </Typography>
            <Box sx={{ display: 'flex', justifyContent:'space-between', alignItems:'center', width: '100%' }}>
                <Typography variant="subtitle2"><b>Deadline: {formatDate(recruitment.deadline)}</b></Typography>
                <Button variant="contained" href={recruitment.application_link} sx={{backgroundColor: 'black', borderRadius: 2}}>Apply Now</Button>
            </Box>
        </Box>
      </CardContent>
    </Card>
  );
}