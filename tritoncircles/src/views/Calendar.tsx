import React, { useState } from "react";
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
  id: number;
  title: string;
  club: string;
  time: string;
  date: Date;
  attending: number;
  tags: string[];
}

const CalendarPage: React.FC = () => {
  const [date, setDate] = useState<Date>(new Date());
  const [clickedDate, setClickedDate] = useState<Date>(new Date());

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
  const events: Event[] = [
    {
      id: 1,
      title: "Introduction to Software Engineering",
      club: "CSE Club",
      time: "5:00 - 6:00 PM",
      date: new Date(2024, 10, 10),
      attending: 2,
      tags: ["CSE", "Interested"],
    },
    {
      id: 2,
      title: "Introduction to Computer Architecture",
      club: "CSE Club",
      time: "6:00 - 7:30 PM",
      date: new Date(2024, 10, 11),
      attending: 2,
      tags: ["CSE", "Interested"],
    },

    {
      id: 3,
      title: "Introduction to Artificial Intelligence",
      club: "CSE Club",
      time: "6:00 - 7:30 PM",
      date: new Date(2024, 10, 12),
      attending: 2,
      tags: ["CSE", "Interested"],
    },
    {
      id: 4,
      title: "Introduction to Computer Vision",
      club: "CSE Club",
      time: "6:00 - 7:30 PM",
      date: new Date(2024, 11, 2),
      attending: 2,
      tags: ["CSE", "Interested"],
    },
  ];

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
      return event.date >= startDate && event.date <= endDate;
    });
  };

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
                                event.date.getDate() === day &&
                                event.date.getMonth() ===
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
                  <Card key={event.id} sx={{ mb: 2 }}>
                    <CardContent>
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 2 }}
                      >
                        <Computer sx={{ color: "primary.main" }} />
                        <Box>
                          <Typography variant="h6">{event.title}</Typography>
                          <Typography color="textSecondary">
                            {event.club} • {event.time}
                          </Typography>
                          <Typography color="textSecondary">
                            {event.date.toDateString()}
                          </Typography>
                          <Box sx={{ display: "flex", gap: 1, mt: 1 }}>
                            {event.tags.map((tag) => (
                              <Chip key={tag} label={tag} size="small" />
                            ))}
                          </Box>
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
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
