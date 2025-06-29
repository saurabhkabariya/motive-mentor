import { inter, robotoMono } from "./fonts";
import "./globals.css";
import Navigation from "@/components/navigation";
import NavigationLoadingBar from "@/components/NavigationLoadingBar";
import PagePreloader from "@/components/PagePreloader";
import { ThemeProvider } from "./themecontext";
import ThemeWrapper from "@/components/ThemeWrapper";
import GoogleAnalytics from "@/components/GoogleAnalytics";
import Footer from "@/components/footer";
import { QuoteProvider } from "./quotecontext";
import { UserProvider } from "./usercontext";
import { OnboardingProvider } from "./onboardingContext";
import { AchievementProvider } from "./achievementContext";
import OnboardingTour from "@/components/OnboardingTour";
import PSAManager from "@/components/PSAManager";
import AuthModalContainer from "@/components/AuthModalContainer";
import FirebaseConnectionStatus from "@/components/FirebaseConnectionStatus";
import AchievementNotification from "@/components/AchievementNotification";
import AchievementsOverlay from "@/components/AchievementsOverlay";
import { Suspense } from "react";
import "@/app/utils/localStorage-patch";

export const metadata = {
  title: "Motive Mentor",
  description: "Motive Mentor provides Daily Motivated quotes to help you stay motivated and be focused towards your goals.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.variable} ${robotoMono.variable}`}>
      <head>
        <meta name="monetag" content="d6ef03b8c2b683319fba93a516a09715" />
        <meta name="google-site-verification" content="HKgvrxQDwRgmswOq7p_GoG2yId-fcWZkSjyAEGC_ASw" />
      </head>
      <body className="antialiased min-h-[100vh] font-sans">
        <UserProvider>
          <QuoteProvider>
            <ThemeProvider>
              <OnboardingProvider>
                <AchievementProvider>
                  <ThemeWrapper>
                    <NavigationLoadingBar />
                    <Navigation />
                    <PagePreloader />
                    <GoogleAnalytics />
                    <AuthModalContainer />
                    <FirebaseConnectionStatus />
                    <OnboardingTour />
                    <PSAManager />
                    <AchievementNotification />
                    <AchievementsOverlay />
                    {children}
                    <Footer />
                  </ThemeWrapper>
                </AchievementProvider>
              </OnboardingProvider>
            </ThemeProvider>
          </QuoteProvider>
        </UserProvider>
      </body>
    </html>
  );
}
