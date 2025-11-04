import NavBar from "../componente/NavBar";
import "./global.css";
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="body">
        <NavBar />
        {children}</body>
    </html>
  );
}