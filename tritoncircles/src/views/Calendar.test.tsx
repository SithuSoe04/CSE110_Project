import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import CalendarPage from "./Calendar";

const formatDate = (date: Date): string => {
  return date.toLocaleDateString();
};

describe("CalendarPage", () => {
  test("renders calendar component", () => {
    render(<CalendarPage />);
    expect(screen.getByText("November 2024")).toBeInTheDocument();
    expect(screen.getByText("Today")).toBeInTheDocument();
  });

  test("renders weekday headers", () => {
    render(<CalendarPage />);
    const weekdays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    weekdays.forEach((day) => {
      expect(screen.getByText(day)).toBeInTheDocument();
    });
  });

  test("handles month navigation", () => {
    render(<CalendarPage />);
    const nextButton = screen.getByRole("button", { name: /next month/i });
    const prevButton = screen.getByRole("button", { name: /previous month/i });

    fireEvent.click(nextButton);
    expect(screen.getByText("December 2024")).toBeInTheDocument();

    fireEvent.click(prevButton);
    expect(screen.getByText("November 2024")).toBeInTheDocument();
  });

  test("displays correct date range in upcoming events", () => {
    render(<CalendarPage />);

    const today = new Date();
    const weekEnd = new Date(today);
    weekEnd.setDate(today.getDate() + 6);

    const expectedDateRange = `${formatDate(today)} - ${formatDate(weekEnd)}`;

    const todayCell = screen.getByText(today.getDate().toString());
    fireEvent.click(todayCell);

    expect(screen.getByText(expectedDateRange)).toBeInTheDocument();
  });

  test("displays clicked date and its events", () => {
    render(<CalendarPage />);

    const dateCell = screen.getByText("10");

    fireEvent.click(dateCell);
    expect(screen.getByText("Upcoming Events")).toBeInTheDocument();
    expect(
      screen.getByText("Introduction to Software Engineering")
    ).toBeInTheDocument();
  });

  test("shows no events message for dates without events", () => {
    render(<CalendarPage />);
    const dateCell = screen.getByText("20");

    fireEvent.click(dateCell);
    expect(
      screen.getByText("No upcoming events for this week")
    ).toBeInTheDocument();
  });

  test("handles Today button click", () => {
    render(<CalendarPage />);
    const nextButton = screen.getByRole("button", { name: /next month/i });
    const todayButton = screen.getByText("Today");

    fireEvent.click(nextButton);
    expect(screen.getByText("December 2024")).toBeInTheDocument();

    fireEvent.click(todayButton);
    expect(screen.getByText("November 2024")).toBeInTheDocument();
  });

  test("updates date range in upcoming events section", () => {
    render(<CalendarPage />);
    const dateCell = screen.getByText("10");

    fireEvent.click(dateCell);
    const startDate = formatDate(new Date(2024, 10, 10));
    const endDate = formatDate(new Date(2024, 10, 16));

    expect(screen.getByText(startDate, { exact: false })).toBeInTheDocument();
    expect(screen.getByText(endDate, { exact: false })).toBeInTheDocument();
  });
});
