// import { Geist, Geist_Mono } from "next/font/google";
// import "./globals.css";
// import Navigation from "@/components/navigation";
// import { ThemeProvider, useTheme } from "./themecontext";
// import Script from "next/script";
// import GoogleAnalytics from "@/components/GoogleAnalytics";

// const geistSans = Geist({
//   variable: "--font-geist-sans",
//   subsets: ["latin"],
// });

// const geistMono = Geist_Mono({
//   variable: "--font-geist-mono",
//   subsets: ["latin"],
// });

// export const metadata = {
//   title: "Motive Mentor",
//   description: "Motive Mentor provides Daily Motivated quotes to help you stay motivated and be focused towards your goals.",
// };


// export default function RootLayout({ children }) {

//   const { darkMode } = useTheme(); 

//   return (
//     <html lang="en">
//       <head>
//         {/* Google Tag Manager */}
//         {/* <Script
//               id="google-tag-manager"
//               strategy="afterInteractive"
//               dangerouslySetInnerHTML={{
//                 __html: `
//                   (function(w,d,s,l,i){
//                     w[l]=w[l]||[];
//                     w[l].push({'gtm.start': new Date().getTime(), event:'gtm.js'});
//                     var f=d.getElementsByTagName(s)[0], j=d.createElement(s), dl=l!='dataLayer'?'&l='+l:'';
//                     j.async=true;
//                     j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;
//                     f.parentNode.insertBefore(j,f);
//                   })(window,document,'script','dataLayer','G-NM53XZPV9N');
//                 `,
//               }}
//             /> */}
//             {/* <Script
//               strategy="lazyOnload"
//               src="https://groleegni.net/401/9084854"
//               data-cfasync="false"
//             /> */}
//             <meta name="monetag" content="d6ef03b8c2b683319fba93a516a09715"></meta>
//       </head>
      
//       <body className={`${geistSans.variable} ${geistMono.variable} antialiased ${darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-black"}`}>

//         {/* Google Tag Manager (noscript) */}
//         {/* <noscript
//           dangerouslySetInnerHTML={{
//             __html: `
//               <iframe src="https://www.googletagmanager.com/ns.html?id=G-NM53XZPV9N"
//               height="0" width="0" style="display:none;visibility:hidden"></iframe>
//             `,
//           }}
//         /> */}


//         <ThemeProvider>
//           <Navigation/>
//           <GoogleAnalytics />
//           {children}
//         </ThemeProvider>
//       </body>
//     </html>
//   );
// }


import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navigation from "@/components/navigation";
import { ThemeProvider } from "./themecontext"; // ✅ No useTheme() here!
import ThemeWrapper from "@/components/ThemeWrapper"; // ✅ Import new client component
import Script from "next/script";
import GoogleAnalytics from "@/components/GoogleAnalytics";
import Footer from "@/components/footer";
import { QuoteProvider } from "./quotecontext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Motive Mentor",
  description: "Motive Mentor provides Daily Motivated quotes to help you stay motivated and be focused towards your goals.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta name="monetag" content="d6ef03b8c2b683319fba93a516a09715"></meta>
        <meta name="google-site-verification" content="HKgvrxQDwRgmswOq7p_GoG2yId-fcWZkSjyAEGC_ASw" />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-[100vh]`}>
        <QuoteProvider>
        {/* ✅ Wrap everything inside ThemeProvider */}
        <ThemeProvider>
          {/* ✅ Now ThemeWrapper handles the theme logic in a client component */}
          <ThemeWrapper>
            <Navigation />
            <GoogleAnalytics />
            {children}
            <Footer/>
          </ThemeWrapper>
        </ThemeProvider>
        </QuoteProvider>
      </body>
    </html>
  );
}
