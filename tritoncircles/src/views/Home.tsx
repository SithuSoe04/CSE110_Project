import React, { useEffect, useState } from "react";
import EventCard from "../components/Events/EventCard";
import Recruitment from "../components/Recruitment/Recruitment";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid2";
import { Typography } from "@mui/material";
import FAQ from "../components/FAQ/FAQ";
import { fetchFavoriteEvents } from "../utils/events-utils";
import { fetchUserRecruitmentPosts } from "../utils/recruitment-utils";

const Home = () => {
  const [favoriteEventsData, setFavoriteEventsData] = useState<{id: number, club: string, club_name: string, title: string, date: string, room: string, incentives: string[], favorite: boolean}[]>([]);
  const [recruitmentData, setRecruitmentData] = useState<{id: number, club: string, club_name: string, title: string, date_posted: string, deadline: string, application_link: string}[]>([])
  useEffect(() => {
    const fetchData = async () => {
      try{
        const favoriteEvents = await fetchFavoriteEvents();
        const newFavoriteEvents = favoriteEvents.map((event: any) => ({ ...event,
            id: event.event_id, 
            club: event.club_id,
            club_name: event.club_name,
            favorite: true,
            incentives: JSON.parse(event.incentives)}));
        setFavoriteEventsData(newFavoriteEvents);
        console.log(favoriteEventsData);
        const recruitmentPosts = await fetchUserRecruitmentPosts();
        const newRecruitmentPosts = recruitmentPosts.map((recruitment: any) => ({...recruitment,
          id: recruitment.recruitment_id,
          club: recruitment.club_id,
        }))
        setRecruitmentData(newRecruitmentPosts);
      }
      catch (error){
        console.error("Error fetching events:", error);
      }
    };
    fetchData()
  }, [])
    return (
      <Box sx={{ flexGrow: 1, margin: "3rem" }}>
        <Typography gutterBottom variant="h4">
          <Box sx={{ fontWeight: "bold" }}>Interested Events</Box>
        </Typography>
        <Grid container spacing={2} mb={5}>
        {favoriteEventsData.length === 0 ?
          <Typography variant="body1" color="text.secondary">
              No favorite events yet. Add events to your favorites in the events page to see your favorite events here.
          </Typography> :       
        favoriteEventsData?.map((data) => (
          <Grid size={3}><EventCard id={data.id} club={data.club_name} title={data.title} date={data.date} room={data.room} favorite={data.favorite} toggleFavorite={()=>{}} incentives={data.incentives}/>
          </Grid>
        ))}
        </Grid>
        <Typography gutterBottom variant="h4">
          <Box sx={{ fontWeight: "bold" }}>Open Positions</Box>
        </Typography>
        {recruitmentData.length === 0 ?  <Typography variant="body1" color="text.secondary" mb={5}>
              No recruitment posts to display. Favorite some clubs to see their available position!
          </Typography> :         
        <Grid container spacing={2} mb={5}>
          {recruitmentData.map(data => 
             <Grid size={3}><Recruitment id={data.id} club={data.club_name} position={data.title} date_posted={data.date_posted} deadline={data.deadline} application_link={data.application_link}/></Grid>
          )}
        </Grid>}
        <Typography gutterBottom variant="h4">
          <Box sx={{ fontWeight: "bold" }}>Frequently Asked Questions (FAQ)</Box>
        </Typography>
        <FAQ />
      </Box>
    );
  };
export default Home;
  