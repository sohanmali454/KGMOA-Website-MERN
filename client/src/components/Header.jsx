import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

export default function Header() {
  return (
    <header className="bg-slate-200 shadow-md ">
      <div className="flex justify-between items-center max-w-6xl mx-auto p-3">
        <Link to="/">
          <h1 className="font-bold text-sm sm:text-xl flex flex-wrap">
            <span className="text-slate-500">LOGO-</span>
            <span className="text-slate-700">KGMOA</span>
          </h1>
        </Link>

        <ul className="flex gap-4">
          <Link to="/">
            <li className="hidden sm:inline text-slate-700 hover:underline">
              Home
            </li>
          </Link>
          <Link to="/about">
            <li className="hidden sm:inline text-slate-700 hover:underline">
              About
            </li>
          </Link>
          <Link to="/activities">
            <li className="hidden sm:inline text-slate-700 hover:underline">
              Activities
            </li>
          </Link>
          <Link to="/events">
            <li className="hidden sm:inline text-slate-700 hover:underline">
              Events
            </li>
          </Link>
          <Link to="/conference-2025">
            <li className="hidden sm:inline text-slate-700 hover:underline">
              Conference 2025
            </li>
          </Link>
          <Link to="/admin-sign-in">
            <li className="hidden sm:inline text-slate-700 hover:underline">
              Sign In
            </li>
          </Link>
        </ul>
      </div>
    </header>
  );
}
