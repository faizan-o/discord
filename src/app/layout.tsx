import { ThemeProvider } from "@/components/providers/theme";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { cn } from "@/lib/utils";
import { Poppins } from "next/font/google";
import NextTopLoader from "nextjs-toploader";
import { Toaster } from "@/components/ui/toaster";
import ModalProvider from "@/components/providers/modal-provider";
import { ServerContextProvider } from "@/components/providers/server-provider";
import SocketContextProvider from "@/components/providers/socket-provider";
import QueryProvider from "@/components/providers/query-provider";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

export const metadata = {
  title: "Discord - A Modern Chat App",
  description:
    "A modern chat application inspired by Discord. Join the conversation with our Discord-inspired chat app. Connect, chat, and collaborate in real-time!",
  keywords: ["discord", "clone", "chat", "audio", "video", "call", "server"],
  openGraph: {
    title: "Discord - A Modern Chat App",
    description:
      "A modern chat application inspired by Discord. Join the conversation with our Discord-inspired chat app. Connect, chat, and collaborate in real-time!",
    images: [`${process.env.NEXT_PUBLIC_SITE_URL || "https://discord0.up.railway.app"}/logo.png`],
    siteName: "ZenMart",
    type: "website", 
  },
};

const RootLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body
          className={cn("dark:bg-zinc-800 vsc-initialized", poppins.className)}
        >
          <NextTopLoader
            color="#ffffff"
            initialPosition={0.08}
            height={1}
            crawl={true}
            showSpinner={true}
            easing="ease"
            shadow="0 0 10px #2299DD,0 0 5px #2299DD"
          />
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem={false}
            storageKey="application-theme"
          >
            <ServerContextProvider>
              <SocketContextProvider>
                <ModalProvider />
                <QueryProvider>
                  <main className="w-full h-full">{children}</main>
                </QueryProvider>
              </SocketContextProvider>
            </ServerContextProvider>
          </ThemeProvider>
          <Toaster />
        </body>
      </html>
    </ClerkProvider>
  );
};

export default RootLayout;
