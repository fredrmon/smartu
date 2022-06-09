export const Colors = {
  red: "rgb(218, 15, 15, 0.6)",
  redTxt: "rgb(125, 21, 0, 1)",
  redLine: "rgb(173, 14, 14, 0.6)",
  yellow: "rgb(243, 190, 3, 0.81)",
  yellowTxt: "rgb(168, 95, 0, 1)",
  yellowLine: "rgb(219, 179, 37, 1)",
  green: "rgb(11, 201, 64, 0.63)",
  greenTxt: "rgb(1, 128, 31, 1)",
  greenLine: "rgb(44, 163, 77, 1)",
  purple: "rgb(93, 78, 142, 1)",
  purpleHover: "rgb(63, 54, 93, 1)",
  orange: "rgb(252, 136, 3, 1)",
  blue: "rgb(74, 183, 255, 1)",
  black: "rgb(35, 31, 32, 1)",
  lightgrey: "rgb(220,220,220)",
  darkgrey: "rgb(169,169,169)",
  white: "rgb(255,255,255)",
  background: "rgb(240, 243, 238)",
  blueShadeA: "#15466B",
  blueShadeB: "#77BAEE",
  blueShadeC: "#2F99EB",
  blueShadeD: "#36546B",
  blueShadeE: "#2578B8",
};

// Constants for thresholds for triggering notifications/highlighting
export const NotificationThreshold = {
  incorrectOption: 0.25,
  incorrectQuestion: 0.5,
  studentScore: 40,
  timeToAnswer: 180,
};

// Score cutoffs (based on NTNU percentage evaluation method)
export const Score = {
  low: 40,
  medium: 64,
};
