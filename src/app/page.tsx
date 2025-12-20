import { Bitcount_Prop_Single } from "next/font/google";
import Link from "next/link";
const bitcount = Bitcount_Prop_Single({
  subsets: ["latin"],
  variable: "--font-bitcount-prop-single",
  weight: ["400"]
});

export default function Home() {
  return (
    <div  className="flex min-h-screen items-center justify-center font-sans bg-black text-zinc-200">
      <h1 className={`${bitcount.className} text-6xl font-bold`}>
        Welcome to eCard!
      </h1>
      <Link href={'/main'} className="absolute bottom-10 text-zinc-400 hover:text-zinc-200">
        Get Started &rarr;
      </Link>
    </div>
  );
}
