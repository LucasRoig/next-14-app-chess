import { Poppins } from "next/font/google";
import { Button } from "../components/ui/button";
import { cn } from "../lib/utils";
import { UserButton } from "@clerk/nextjs";

const font = Poppins({ 
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600", "700", "800"],
  display: "swap", //Fix network error to load font
  adjustFontFallback: false, //Fix network error to load font
});

export default function HomePage() {
  return (
    <div>
      <h1 className="bg-red-500">Welcome to Chess Trainer</h1>
      <p>Learn and improve your chess skills</p>
      <Button className={cn(font.className)} variant="secondary">Get Started Now</Button>
      <UserButton />
    </div>
  )
}