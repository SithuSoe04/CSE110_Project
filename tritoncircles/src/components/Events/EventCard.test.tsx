import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import Events from "../../views/Events";

test("toggles favorite status when clicking the favorite icon", () => {
  render(<Events/>)
  // This would select the favorite icon of the first event component displayed. In our case, it would be from the favorites section.
  const favoriteIcon = screen.getAllByLabelText("add to favorites")[0];
  const favoriteEventCards = screen.getAllByTestId(/favorite-event-/); 
  expect(favoriteEventCards.length).toBe(2);
  fireEvent.click(favoriteIcon);
  const newFavoriteEventCards = screen.getAllByTestId(/favorite-event-/); 
  expect(newFavoriteEventCards.length).toBe(1);
});

