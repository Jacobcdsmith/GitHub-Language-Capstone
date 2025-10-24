import { Link } from "wouter";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#0d1117] text-white flex flex-col items-center justify-center gap-6 p-6 text-center">
      <div className="text-7xl">🛰️</div>
      <div>
        <h1 className="text-4xl font-bold mb-2">Page not found</h1>
        <p className="text-[#8b949e] max-w-md">
          The route you requested does not exist. Head back to the dashboard to continue exploring language analytics.
        </p>
      </div>
      <Link href="/">
        <button className="px-6 py-3 bg-[#58a6ff] hover:bg-[#4a9aef] rounded-lg font-semibold transition-colors">
          Return Home
        </button>
      </Link>
    </div>
  );
}
