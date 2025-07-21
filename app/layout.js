import "./globals.css";

export const metadata = {
  title: "dApp Template",
  description: "A simple dApp template using Next.js and Ethers.js",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
