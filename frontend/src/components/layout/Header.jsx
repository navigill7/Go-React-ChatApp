const Header = ({ user, onLogout }) => (
  <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-tl-3xl">
    <h1 className="text-xl font-bold">GopherChat</h1>
    <div className="flex items-center space-x-3">
      <span className="hidden md:inline">Hello, {user?.username}</span>
      <button
        onClick={onLogout}
        className="px-3 py-1 bg-white/20 hover:bg-white/30 rounded-full text-sm transition"
      >
        Logout
      </button>
    </div>
  </div>
);

export default Header;