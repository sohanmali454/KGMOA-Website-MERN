import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

export default function Header() {
  return (
    <>
      <header className="text-slate-400 bg-gray-900 fixed top-0 left-0 w-full z-50">
        <div className="flex justify-between items-center max-w-6xl mx-auto p-3">
          <Link to="/">
            <h1 className="font-bold text-sm sm:text-xl flex flex-wrap">
              <span className="text-slate-500">LOGO-</span>
              <span className="">KGMOA</span>
            </h1>
          </Link>

          <ul className="flex gap-4">
            <Link to="/">
              <li className="hidden sm:inline hover:text-white">Home</li>
            </Link>
            <Link to="/about">
              <li className="hidden sm:inline hover:text-white">About</li>
            </Link>
            <Link to="/activities">
              <li className="hidden sm:inline hover:text-white">Activities</li>
            </Link>
            <Link to="/events">
              <li className="hidden sm:inline hover:text-white">Events</li>
            </Link>
            <Link to="/user-registration">
              <li className="hidden sm:inline hover:text-white">
                Conference 2025
              </li>
            </Link>
            <Link to="/admin-sign-in">
              <li className="hidden sm:inline hover:text-white">Sign In</li>
            </Link>
          </ul>
        </div>
      </header>
    </>
  );
}
