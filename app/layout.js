import "./globals.css"
// Import Nunito font from Google Fonts
const nunitoFontLink =
  "https://fonts.googleapis.com/css?family=Nunito:400&display=swap"

// AIzaSyDgj7kz2yYtJmrVWjvND_gCVz0R3DX1ADM

export const metadata = {
  title: {
    absolute: "",
    default: "FitnessJoin | Your fitness, our concern",
    template: "%s | FitnessJoin",
  },
  description: "Find all the possible features on this app",
}
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        {/* Link to Nunito font */}
        <link rel="stylesheet" href={nunitoFontLink} />
      </head>
      <body>{children}</body>
    </html>
  )
}
