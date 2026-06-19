export default function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-white mt-12 py-8 px-6">
      <div className="max-w-4xl mx-auto text-center space-y-3">
        <p className="text-sm text-gray-500">
          Education is free and should be accessible to everyone.
        </p>
        <a
          href="https://creativecommons.org/publicdomain/zero/1.0/deed.en"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-xs text-gray-400 hover:text-gray-600 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 64 64" fill="currentColor" aria-label="CC0 logo">
            <circle cx="32" cy="32" r="30" fill="none" stroke="currentColor" strokeWidth="3" />
            <text x="32" y="24" textAnchor="middle" fontSize="14" fontWeight="bold" dy=".3em" fill="currentColor">CC</text>
            <text x="32" y="44" textAnchor="middle" fontSize="14" fontWeight="bold" dy=".3em" fill="currentColor">0</text>
          </svg>
          <span>CC0 1.0 Universal — 2026</span>
        </a>
      </div>
    </footer>
  );
}
