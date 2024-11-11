import * as React from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';

export default function Recruitment() {
  return (
    <Card sx={{ minWidth: 275, minHeight: 275, backgroundColor: '#89cff0'}}>
      <CardContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent:'space-between', alignItems:'center', height: '250px' }}>
            <Box sx={{ display: 'flex', justifyContent:'space-between', alignItems:'center', width: '100%' }}>
                <Chip label="3 Nov 2024" variant="outlined" size="medium" sx={{backgroundColor: 'white'}}/>
                <Chip label="CSES" color="secondary" size="small" />
            </Box>
            <Typography variant="h4">
                <Box sx={{fontWeight: "bold"}}>Marketing Director</Box>
            </Typography>
            <Box sx={{ display: 'flex', justifyContent:'space-between', alignItems:'center', width: '100%' }}>
                <Typography variant="subtitle2"><b>Deadline: 11 Nov 2024</b></Typography>
                <Button variant="contained" sx={{backgroundColor: 'black', borderRadius: 2}}>Apply Now</Button>
            </Box>
        </Box>
      </CardContent>
    </Card>
  );
}