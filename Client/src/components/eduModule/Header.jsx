import { Link } from 'react-router-dom';
import { User, BookOpen } from 'lucide-react';

export default function Header() {
  return (
    <header className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="bg-gradient-to-br from-blue-400 to-purple-400 p-2 rounded-xl shadow-md group-hover:shadow-lg transition-shadow">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                SnapFix
              </h1>
              <p className="text-xs text-gray-500">Empowering Citizens</p>
            </div>
          </Link>

          <Link
            to="/profile"
            className="flex items-center gap-2 bg-gradient-to-r from-blue-50 to-purple-50 px-4 py-2 rounded-full hover:shadow-md transition-all"
          >
            <User className="w-5 h-5 text-blue-600" />
            <span className="text-sm font-medium text-gray-700 hidden sm:inline">Profile</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
