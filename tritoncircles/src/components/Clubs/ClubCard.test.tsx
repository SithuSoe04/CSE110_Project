import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import Clubs from "../../views/Clubs";

test("toggles favorite status when clicking the favorite icon", () => {
  render(<Clubs />);
  
  // Select the favorite icon of the first club component displayed. 
  // This assumes the first item in the favorite clubs section is already marked as a favorite.
  const favoriteIcon = screen.getAllByLabelText("add to favorites")[0];
  const favoriteClubCards = screen.getAllByTestId(/favorite-club-/); 
  
  // Initial favorite count in the "Favorite Clubs" section.
  expect(favoriteClubCards.length).toBe(2);
  
  // Toggle the favorite status by clicking the favorite icon.
  fireEvent.click(favoriteIcon);
  
  // Updated favorite count after toggling.
  const newFavoriteClubCards = screen.getAllByTestId(/favorite-club-/); 
  expect(newFavoriteClubCards.length).toBe(1);
});
