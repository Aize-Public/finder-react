export const metadata = {
  title: "Finder",
  description: "The application helps us in finding what we are looking for.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
