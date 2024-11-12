import React from "react";
import { render, screen } from "@testing-library/react";
import Recruitment from "./Recruitment";

test("Apply Now button redirects to correct link", () => {
  const recruitmentData = {
    id: 1,
    club: "CSES",
    position: "Marketing Director",
    date_posted: "3 Nov 2024",
    deadline: "12 Nov 2024",
    application_link: "https://www.google.com/",
  };
  render(<Recruitment {...recruitmentData} />);
  const applyButton = screen.getByText("Apply Now");
  expect(applyButton).toHaveAttribute("href", recruitmentData.application_link);
});
