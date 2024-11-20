import React, { useState, useEffect } from "react";
import EventCard from "../components/Events/EventCard";
import {
  Box,
  Typography,
  IconButton,
  Grid,
  Paper,
  Card,
  CardContent,
  Chip,
  Button,
} from "@mui/material";
import {
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  Computer,
} from "@mui/icons-material";

interface Event {
  event_id: number;
  club_id: number;
  title: string;
  date: string;
  room: string;
  incentives?: string;
  // Adding computed properties for UI
  club?: string;
  time?: string;
  attending?: number;
  tags?: string[];
  favorite?: boolean;
}

const CalendarPage: React.FC = () => {
  const [date, setDate] = useState<Date>(new Date());
  const [clickedDate, setClickedDate] = useState<Date>(new Date());
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const response = await fetch("/events", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // if using sessions
      });
      if (!response.ok) {
        throw new Error("Failed to fetch events");
      }
      const data = await response.json();

      // Transform the API data to match our UI needs
      const transformedEvents = data.data.map((event: Event) => ({
        ...event,
        // Convert the date string to a Date object for easier comparison
        date: new Date(event.date),
        // Extract time from the date string (might need to adjust this based on date format)
        time: new Date(event.date).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        // Add default values for UI elements
        club: `Club ${event.club_id}`,
        attending: 0,
        tags: event.incentives ? [event.incentives] : [],
      }));

      setEvents(transformedEvents);
      setError(null);
    } catch (err) {
      setError("Failed to fetch events");
      console.error("Error fetching events:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  // Monthly view functions
  const getPreviousMonthDays = (year: number, month: number): number[] => {
    const firstDayOfMonth = new Date(year, month, 1);
    let dayOfWeek = firstDayOfMonth.getDay();
    dayOfWeek = dayOfWeek === 0 ? 7 : dayOfWeek;

    const daysNeeded = dayOfWeek - 1;
    const previousMonth = new Date(year, month, 0);
    const lastDayPrevMonth = previousMonth.getDate();

    const days: number[] = [];
    for (let i = daysNeeded - 1; i >= 0; i--) {
      days.push(lastDayPrevMonth - i);
    }
    return days;
  };

  const getNextMonthDays = (year: number, month: number): number[] => {
    const lastDayOfMonth = new Date(year, month + 1, 0);
    let dayOfWeek = lastDayOfMonth.getDay();
    dayOfWeek = dayOfWeek === 0 ? 7 : dayOfWeek;

    const daysNeeded = 7 - dayOfWeek;
    const days: number[] = [];
    for (let i = 1; i <= daysNeeded; i++) {
      days.push(i);
    }
    return days;
  };

  const getCalendarDays = (
    currentDate: Date
  ): { day: number; isCurrentMonth: boolean }[][] => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const previousMonthDays = getPreviousMonthDays(year, month).map((day) => ({
      day,
      isCurrentMonth: false,
    }));

    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const currentMonthDays = Array.from({ length: daysInMonth }, (_, i) => ({
      day: i + 1,
      isCurrentMonth: true,
    }));

    const nextMonthDays = getNextMonthDays(year, month).map((day) => ({
      day,
      isCurrentMonth: false,
    }));

    const allDays = [
      ...previousMonthDays,
      ...currentMonthDays,
      ...nextMonthDays,
    ];

    // Group days into weeks
    const weeks: { day: number; isCurrentMonth: boolean }[][] = [];
    for (let i = 0; i < allDays.length; i += 7) {
      weeks.push(allDays.slice(i, i + 7));
    }

    return weeks;
  };

  // Sample events data
  //   const events: Event[] = [
  //     {
  //       id: 1,
  //       title: "Introduction to Software Engineering",
  //       club: "CSE Club",
  //       time: "5:00 - 6:00 PM",
  //       date: new Date(2024, 10, 10),
  //       attending: 2,
  //       tags: ["CSE", "Interested"],
  //     },
  //     {
  //       id: 2,
  //       title: "Introduction to Computer Architecture",
  //       club: "CSE Club",
  //       time: "6:00 - 7:30 PM",
  //       date: new Date(2024, 10, 11),
  //       attending: 2,
  //       tags: ["CSE", "Interested"],
  //     },

  //     {
  //       id: 3,
  //       title: "Introduction to Artificial Intelligence",
  //       club: "CSE Club",
  //       time: "6:00 - 7:30 PM",
  //       date: new Date(2024, 10, 12),
  //       attending: 2,
  //       tags: ["CSE", "Interested"],
  //     },
  //     {
  //       id: 4,
  //       title: "Introduction to Computer Vision",
  //       club: "CSE Club",
  //       time: "6:00 - 7:30 PM",
  //       date: new Date(2024, 11, 2),
  //       attending: 2,
  //       tags: ["CSE", "Interested"],
  //     },
  //   ];

  const handlePrevious = (): void => {
    setDate(new Date(date.getFullYear(), date.getMonth() - 1));
  };

  const handleNext = (): void => {
    setDate(new Date(date.getFullYear(), date.getMonth() + 1));
  };

  const handleToday = (): void => {
    const today = new Date();
    setDate(today);
    setClickedDate(today);
  };

  const monthNames: string[] = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const days: string[] = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  // Function to check if a date is today
  const isToday = (
    checkDate: Date | number,
    isCurrentMonth: boolean = true
  ): boolean => {
    const today = new Date();
    if (typeof checkDate === "number") {
      if (!isCurrentMonth) return false;
      return (
        checkDate === today.getDate() &&
        date.getMonth() === today.getMonth() &&
        date.getFullYear() === today.getFullYear()
      );
    } else {
      return (
        checkDate.getDate() === today.getDate() &&
        checkDate.getMonth() === today.getMonth() &&
        checkDate.getFullYear() === today.getFullYear()
      );
    }
  };

  // Function to check if a date is the clicked date
  const isClickedDate = (checkDate: number, checkMonth: number): boolean => {
    return (
      clickedDate !== null &&
      checkDate === clickedDate.getDate() &&
      checkMonth === clickedDate.getMonth() &&
      date.getFullYear() === clickedDate.getFullYear()
    );
  };

  // Add this helper function
  const getEventsInRange = (startDate: Date, events: Event[]): Event[] => {
    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + 6);

    return events.filter((event) => {
      const eventDate = new Date(event.date);
      return eventDate >= startDate && eventDate <= endDate;
    });
  };

  if (loading) {
    return (
      <Box
        sx={{
          p: 3,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Typography>Loading events...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box
        sx={{
          p: 3,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3, maxWidth: 1400, margin: "0 auto", mt: 8 }}>
      <Grid container spacing={3}>
        {/* Left Column - Calendar */}
        <Grid item xs={8}>
          {/* Calendar Header */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 3,
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <IconButton onClick={handlePrevious} aria-label="previous month">
                <ChevronLeftIcon />
              </IconButton>
              <Typography variant="h5">
                {`${monthNames[date.getMonth()]} ${date.getFullYear()}`}
              </Typography>
              <IconButton onClick={handleNext} aria-label="next month">
                <ChevronRightIcon />
              </IconButton>
            </Box>
            <Button variant="contained" onClick={handleToday}>
              Today
            </Button>
          </Box>

          {/* Calendar Grid */}
          <Paper elevation={2} sx={{ mb: 4, p: 2, backgroundColor: "#fff" }}>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <Grid container spacing={1} sx={{ maxWidth: 700 }}>
                {/* Day headers */}
                {days.map((day) => (
                  <Grid item xs={1} key={day} sx={{ textAlign: "center" }}>
                    <Typography sx={{ fontWeight: "bold" }}>{day}</Typography>
                  </Grid>
                ))}

                {/* Calendar days */}
                {getCalendarDays(date).map((week, weekIndex) => (
                  <Grid container item spacing={1} key={weekIndex}>
                    {week.map(({ day, isCurrentMonth }, dayIndex) => (
                      <Grid
                        item
                        xs={1}
                        key={dayIndex}
                        sx={{ textAlign: "center" }}
                      >
                        <Paper
                          elevation={0}
                          sx={{
                            p: 1,
                            backgroundColor: isToday(day, isCurrentMonth)
                              ? "#e3f2fd"
                              : "transparent",
                            borderRadius: "50%",
                            width: 40,
                            height: 40,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            margin: "0 auto",
                            position: "relative",
                            opacity: isCurrentMonth ? 1 : 0.4,
                            cursor: "pointer",
                            border: isClickedDate(
                              day,
                              isCurrentMonth
                                ? date.getMonth()
                                : day > 15
                                ? date.getMonth() - 1
                                : date.getMonth() + 1
                            )
                              ? "2px solid #2196f3"
                              : "none",
                          }}
                          onClick={() =>
                            setClickedDate(
                              new Date(
                                date.getFullYear(),
                                isCurrentMonth
                                  ? date.getMonth()
                                  : day > 15
                                  ? date.getMonth() - 1
                                  : date.getMonth() + 1,
                                day
                              )
                            )
                          }
                        >
                          {day}
                          {isCurrentMonth &&
                            events.some(
                              (event) =>
                                new Date(event.date).getDate() === day &&
                                new Date(event.date).getMonth() ===
                                  (isCurrentMonth
                                    ? date.getMonth()
                                    : day > 15
                                    ? date.getMonth() - 1
                                    : date.getMonth() + 1)
                            ) && (
                              <Box
                                sx={{
                                  width: 4,
                                  height: 4,
                                  backgroundColor: "primary.main",
                                  borderRadius: "50%",
                                  position: "absolute",
                                  top: 2,
                                  right: 2,
                                }}
                              />
                            )}
                        </Paper>
                      </Grid>
                    ))}
                  </Grid>
                ))}
              </Grid>
            </Box>
          </Paper>
        </Grid>

        {/* Right Column - Upcoming Events */}
        <Grid item xs={4}>
          {clickedDate && (
            <Paper elevation={2} sx={{ p: 3, backgroundColor: "#fff" }}>
              <Typography variant="h6" sx={{ mb: 1 }}>
                Upcoming Events
              </Typography>
              <Typography
                variant="subtitle1"
                color="textSecondary"
                sx={{ mb: 2 }}
              >
                {clickedDate.toLocaleDateString()} -{" "}
                {new Date(
                  new Date(clickedDate).setDate(clickedDate.getDate() + 6)
                ).toLocaleDateString()}
              </Typography>
              {getEventsInRange(clickedDate, events).length > 0 ? (
                getEventsInRange(clickedDate, events).map((event) => (
                  <EventCard
                    key={event.event_id}
                    id={event.event_id}
                    club={event.club || ""}
                    title={event.title}
                    date={new Date(event.date).toDateString()}
                    room={event.room}
                    favorite={event.favorite || false}
                    incentives={
                      Array.isArray(event.incentives) ? event.incentives : []
                    }
                    toggleFavorite={(id) => {
                      setEvents((prevEvents) =>
                        prevEvents.map((e) =>
                          e.event_id === id
                            ? { ...e, favorite: !e.favorite }
                            : e
                        )
                      );
                    }}
                  />
                ))
              ) : (
                <Typography color="textSecondary">
                  No upcoming events for this week
                </Typography>
              )}
            </Paper>
          )}
        </Grid>
      </Grid>
    </Box>
  );
};

export default CalendarPage;
