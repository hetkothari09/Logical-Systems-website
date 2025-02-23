import NextHead from 'next/head';

const Head = () => {
  return (
    <NextHead>
      <title>Logical Systems - Premium IT Solutions & Services</title>
      <meta name="description" content="Your trusted partner for premium IT solutions, including CCTV systems, laptops, computers, servers, and professional IT services." />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta name="keywords" content="IT solutions, CCTV, laptops, computers, servers, IT services, hardware repair" />
      <link rel="icon" href="/favicon.ico" />
      
      {/* Open Graph */}
      <meta property="og:title" content="Logical Systems - Premium IT Solutions & Services" />
      <meta property="og:description" content="Your trusted partner for premium IT solutions, including CCTV systems, laptops, computers, servers, and professional IT services." />
      <meta property="og:type" content="website" />
      <meta property="og:image" content="/og-image.jpg" />
    </NextHead>
  );
};

export default Head; 