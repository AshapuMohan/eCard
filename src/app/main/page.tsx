import { Bitcount_Prop_Single, Roboto_Mono } from "next/font/google";
import { FaEnvelope, FaGithub, FaLinkedin, FaPhone, FaTwitter } from "react-icons/fa6";
import Image from "next/image";
import Link from "next/link";
import "./page.css";
const bitcount = Bitcount_Prop_Single({
  subsets: ["latin"],
  variable: "--font-bitcount-prop-single",
  weight: ["400"]
});

const robotoMono = Roboto_Mono({
  subsets: ["latin"],
  variable: "--font-roboto-mono",
  weight: ["400", "700"]
});

function LeftCard() {
  return (
    <div className="grid lg:grid-cols-2 md:grid-cols-2 sm:grid-cols-1 h-[280px]">
      <div className="bg-transparent border border-zinc-600 p-4 flex rounded-lg m-2 justify-between shadow-md sm:mr-0 mb-4">
        <Image src="/Mohan.jpg" alt="eCard Demo" width={150} height={150} className="rounded-md my-6 object-cover" />
        <div className="pl-4">
          <h2 className="text-xl font-semibold mt-2 mb-2">Ashapu Mohan</h2>
          <p className="text-md font-semibold">Web Developer</p>
          <h3 className="text-md font-semibold my-2">Tech Stack:</h3>
          <ul className="grid grid-cols-3 text-sm gap-1 [&>li]:bg-gray-800 [&>li]:text-white [&>li]:px-1.5 [&>li]:py-1 [&>li]:rounded-3xl">
            <li>JS</li>
            <li>React</li>
            <li>Next</li>
            <li>Tailwind</li>
            <li>Node</li>
            <li>Express</li>
            <li>MongoDB</li>
            <li>Postgres</li>
          </ul>
          <div className="social-icons flex mt-4 mx-3">
            <ul className="flex space-x-5">
              <li>
                <a href="mailto:ashapumohan123@gmail.com" target="_blank" rel="noopener noreferrer">
                  <FaEnvelope size={24} />
                </a>
              </li>
              <li>
                <a href="https://github.com/AshapuMohan" target="_blank" rel="noopener noreferrer">
                  <FaGithub size={24} />
                </a>
              </li>
              <li>
                <a href="https://www.linkedin.com/in/mohan-ashapu-724aba258/" target="_blank" rel="noopener noreferrer">
                  <FaLinkedin size={24} />
                </a>
              </li>
              <li>
                <a href="tel:+917989909756" target="_blank" rel="noopener noreferrer">
                  <FaTwitter size={24} />
                </a>
              </li>
              <li>
                <a href="tel:+917989909756" target="_blank" rel="noopener noreferrer">
                  <FaPhone size={24} />
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div className="bg-transparent p-4 rounded-lg shadow-md m-2 sm:ml-0 mb-4">
        <h2 className="text-xl font-semibold mb-2">Key Features:</h2>
        <ul className="list-disc list-inside space-y-2">
          <li>Acts as digital identity card</li>
          <li>Gives a quick overview of my skills and areas of expertise</li>
          <li>Helps viewers recognize you instantly</li>
          <li>Provides easy access to my social profiles</li>
        </ul>
      </div>
    </div>
  );
}
function RightCard() {
  return (
    <div className="grid lg:grid-cols-2 md:grid-cols-2 sm:grid-cols-1 h-[280px]">
      <div className="bg-transparent ml-5 p-4 rounded-lg shadow-md m-2 sm:ml-0 mb-4">
        <h2 className="text-xl font-semibold mb-2">Key Features:</h2>
        <ul className="list-disc list-inside space-y-2">
          <li>Get instant access to my projects, resume.</li>
          <li>Scan to explore my complete information.</li>
          <li>View full project details, code samples.</li>
        </ul>
      </div>
      <div className="bg-transparent border border-zinc-600 p-4 flex rounded-lg m-2 justify-between shadow-md sm:mr-0 mb-4">

        {/* Left Section */}
        <div className="flex flex-col space-y-4">

          {/* Resume */}
          <div>
            <p className="font-medium mb-2">Resume</p>
            <a
              href="https://drive.google.com/file/d/1oWtvYtDqeeuNQJaQQyKZHejluNSxEBlQ/view?usp=sharing"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Image width={24} height={24} src="/file.svg" alt="Resume" />
            </a>
          </div>

          {/* Projects */}
          <div>
            <p className="font-medium mb-2">Projects</p>
            <div className="flex flex-col space-y-3">
              <a
                className="flex items-center space-x-2 hover:underline"
                href="https://edu-matrix-pied.vercel.app/stu-home"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Image src="/globe.svg" alt="Edumatrix" width={20} height={20} />
                <span>Edumatrix</span>
              </a>
              <a
                className="flex items-center space-x-2 hover:underline"
                href="https://vehicle-aid-pi.vercel.app/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Image src="/globe.svg" alt="LinkedIn" width={20} height={20} />
                <span>VehicleAid</span>
              </a>
              <a
                className="flex items-center space-x-2 hover:underline"
                href="https://linkedinclone-o7l9.onrender.com/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Image src="/globe.svg" alt="Phone" width={20} height={20} />
                <p>Linkedin Ui Clone</p>
              </a>
            </div>
          </div>
        </div>

        {/* Right Section */}
        <div className="flex flex-col items-center">
          <p className="font-semibold mb-2">Scan to view</p>
          <Image
            src="/qr.png"
            alt="eCard QR"
            width={150}
            height={100}
            className="rounded-md mb-3 object-cover"
          />
          <div className="text-center">
            <p className="text-md font-semibold">Let’s Connect</p>
            <p className="text-sm">Mohan | Web Developer</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Main() {
  return (
    <div className="min-h-screen justify-center font-sans bg-black text-zinc-200">
      <h1 className={`${bitcount.className} flex flex-col text-center text-4xl pt-5 font-bold`}>Welcome to eCard!</h1>
      <div className={`p-5 text-center ${robotoMono.className} font-mono text-zinc-300`}>
        <p className="mb-4 font-bold text-2xl">
          Your Identity. Your Skills. One Smart Card.
        </p>
        <div className="max-w-4xl mx-auto text-left space-y-4">
          <div className="bg-zinc-900 p-4 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-2">What is eCard?</h2>
            <p>
              eCard is a cutting-edge digital identity platform that empowers users to create, manage, and share their professional profiles securely.
            </p>
          </div>
          <LeftCard />
          <div className="w-full flex ml-1 justify-center z-100 -m-6">
            <div className="curved-connector-dark text-center p-2 hover:">Demo eCard</div>
          </div>
          <RightCard />
        </div>
        <div>
          <p className="mt-8  mb-5">
            Explore the features of eCard and see how it can revolutionize the way you present your professional identity.
          </p>
          <Link href="/login" className="bg-white px-3 py-2 text-black rounded-full font-bold hover:">Create eCard &rarr;</Link>
        </div>
        <div className="text-center mt-8 mb-4 text-sm text-zinc-500">
          © 2025 Ashapu Mohan. All rights reserved.
        </div>
      </div>
    </div>
  );
}