import React, { useState, useEffect, useCallback, useMemo } from "react";
import EventCard from "../components/Events/EventCard";
import {
  Box,
  Typography,
  IconButton,
  Grid,
  Paper,
  Button,
  Snackbar,
  Alert,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import {
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
} from "@mui/icons-material";
import { API_BASE_URL } from "../constants/constants";

interface Event {
  event_id: number;
  club_id: number;
  title: string;
  date: Date;
  room: string;
  incentives: string[];
  club?: string;
  time?: string;
  attending?: number;
  tags?: string[];
  favorite?: boolean;
  notified?: boolean;
}

const CalendarPage: React.FC = () => {
  const [date, setDate] = useState<Date>(new Date());
  const [clickedDate, setClickedDate] = useState<Date>(new Date());
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showNotification, setShowNotification] = useState(false);
  const [notifications, setNotifications] = useState<
    {
      id: number;
      message: string;
      acknowledged: boolean;
    }[]
  >([]);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md")); // md = 900px

  const fetchEvents = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/events`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch events");
      }

      const data = await response.json();

      const transformedEvents = data.data.map((event: Event) => ({
        ...event,
        date: new Date(event.date),
        time: new Date(event.date).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        club: `Club ${event.club_id}`,
        attending: 0,
        tags: Array.isArray(event.incentives) ? event.incentives : [],
      }));

      setEvents(transformedEvents);
      setError(null);
    } catch (err) {
      setError("Failed to fetch events");
      console.error("Error fetching events:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  const checkUpcomingEvents = useCallback(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);

    const upcomingEvents = events.filter((event) => {
      const eventDate = new Date(event.date);
      eventDate.setHours(0, 0, 0, 0);
      return eventDate.getTime() === tomorrow.getTime() && !event.notified;
    });

    if (upcomingEvents.length > 0) {
      // Clear existing notifications first
      setNotifications([]);

      const newNotifications = upcomingEvents
        .filter((event) => !event.notified) // Only add if not already notified
        .map((event) => ({
          id: event.event_id,
          message: `Reminder: "${event.title}" is tomorrow at ${event.time}`,
          acknowledged: false,
        }));

      if (newNotifications.length > 0) {
        setNotifications(newNotifications); // Replace instead of append

        setEvents((prev) =>
          prev.map((event) =>
            upcomingEvents.some((e) => e.event_id === event.event_id)
              ? { ...event, notified: true }
              : event
          )
        );
      }
    }
  }, [events]);

  const handleDismissNotification = (id: number) => {
    setNotifications((prev) =>
      prev.filter((notification) => notification.id !== id)
    );
  };

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  useEffect(() => {
    checkUpcomingEvents();
    const interval = setInterval(checkUpcomingEvents, 3600000); // Check every hour

    return () => clearInterval(interval);
  }, [checkUpcomingEvents]);

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

    return events
      .filter((event) => {
        const eventDate = new Date(event.date);
        return eventDate >= startDate && eventDate <= endDate;
      })
      .sort((a, b) => {
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);
        return dateA.getTime() - dateB.getTime();
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
      <Grid container spacing={3} direction={isMobile ? "column" : "row"}>
        {/* Calendar */}
        <Grid item xs={12} md={8}>
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
              <Grid container spacing={0.5} sx={{ maxWidth: 500 }}>
                {/* Day headers */}
                {days.map((day) => (
                  <Grid
                    item
                    xs={12 / 7}
                    key={day}
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Typography sx={{ fontWeight: "bold" }}>{day}</Typography>
                  </Grid>
                ))}

                {/* Calendar days */}
                {getCalendarDays(date).map((week, weekIndex) => (
                  <Grid container item spacing={0} key={weekIndex}>
                    {week.map(({ day, isCurrentMonth }, dayIndex) => (
                      <Grid
                        item
                        xs={12 / 7}
                        key={dayIndex}
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          py: 0.5,
                        }}
                      >
                        <Paper
                          elevation={0}
                          sx={{
                            backgroundColor: isToday(day, isCurrentMonth)
                              ? "#e3f2fd"
                              : "transparent",
                            borderRadius: "50%",
                            width: 36,
                            height: 36,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
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
        <Grid item xs={12} md={4}>
          {clickedDate && (
            <Paper elevation={2} sx={{ p: 3, backgroundColor: "#fff" }}>
              {/* Fixed Header */}
              <Box
                sx={{
                  position: "sticky",
                  top: 0,
                  backgroundColor: "#fff",
                  pb: 2,
                }}
              >
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
              </Box>

              {/* Scrollable Content */}
              <Box
                sx={{
                  maxHeight: "60vh",
                  overflowY: "auto",
                  "&::-webkit-scrollbar": {
                    width: "8px",
                  },
                  "&::-webkit-scrollbar-track": {
                    background: "#f1f1f1",
                  },
                  "&::-webkit-scrollbar-thumb": {
                    background: "#888",
                    borderRadius: "4px",
                  },
                  "&::-webkit-scrollbar-thumb:hover": {
                    background: "#555",
                  },
                }}
              >
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
              </Box>
            </Paper>
          )}
        </Grid>
      </Grid>
      {notifications.map((notification) => (
        <Snackbar
          key={notification.id}
          open={true}
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
          sx={{
            position: "fixed",
            mt: notifications.indexOf(notification) * 80,
          }}
        >
          <Alert
            severity="info"
            sx={{
              width: "100%",
              backgroundColor: "#fff",
              border: "1px solid #2196f3",
              "& .MuiAlert-message": {
                flex: 1,
              },
            }}
            action={
              <Box sx={{ display: "flex", gap: 1 }}>
                <Button
                  color="primary"
                  size="small"
                  onClick={() => handleDismissNotification(notification.id)}
                >
                  Dismiss
                </Button>
              </Box>
            }
          >
            {notification.message}
          </Alert>
        </Snackbar>
      ))}
    </Box>
  );
};

export default CalendarPage;
