import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-elk-canvas text-center px-6">
      <h1 className="text-8xl font-extrabold text-elk-red mb-4">404</h1>
      <h2 className="text-2xl font-bold text-gray-900 mb-2">Page Not Found</h2>
      <p className="text-gray-500 mb-8">The page you're looking for doesn't exist.</p>
      <Link
        to="/"
        className="px-6 py-3 bg-elk-red hover:bg-red-700 text-white font-semibold rounded-xl transition-colors"
      >
        Go Home
      </Link>
    </div>
  );
}
