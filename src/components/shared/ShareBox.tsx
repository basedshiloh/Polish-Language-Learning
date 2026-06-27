'use client';

import { useState, useEffect } from 'react';
import { Link2, Check, Download, Share2 } from 'lucide-react';

interface ShareBoxProps {
  title: string;
  label?: string; // e.g. "lesson" or "page"
}

function FacebookIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-[18px] h-[18px]" fill="currentColor" aria-hidden="true">
      <path d="M9.101 23.691v-7.98H6.627v-3.667h2.474v-1.58c0-4.085 1.848-5.978 5.858-5.978.401 0 .955.042 1.468.103a8.68 8.68 0 0 1 1.141.195v3.325a8.623 8.623 0 0 0-.653-.036 26.805 26.805 0 0 0-.733-.009c-.707 0-1.259.096-1.675.309a1.686 1.686 0 0 0-.679.622c-.258.42-.374.995-.374 1.752v1.297h3.919l-.386 2.103-.287 1.564h-3.246v8.245C19.396 23.238 24 18.179 24 12.044c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.628 3.874 10.35 9.101 11.647Z" />
    </svg>
  );
}

function XIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-[18px] h-[18px]" fill="currentColor" aria-hidden="true">
      <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z" />
    </svg>
  );
}

function BlueskyIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-[18px] h-[18px]" fill="currentColor" aria-hidden="true">
      <path d="M12 10.8c-1.087-2.114-4.046-6.053-6.798-7.995C2.566.944 1.561 1.266.902 1.565.139 1.908 0 3.08 0 3.768c0 .69.378 5.65.624 6.479.815 2.736 3.713 3.66 6.383 3.364.136-.02.275-.039.415-.056-.138.022-.276.04-.415.056-3.912.58-7.387 2.005-2.83 7.078 5.013 5.19 6.87-1.113 7.823-4.308.953 3.195 2.05 9.271 7.733 4.308 4.267-4.308 1.172-6.498-2.74-7.078a8.741 8.741 0 0 1-.415-.056c.14.017.279.036.415.056 2.67.297 5.568-.628 6.383-3.364.246-.828.624-5.79.624-6.478 0-.69-.139-1.861-.902-2.206-.659-.298-1.664-.62-4.3 1.24C16.046 4.748 13.087 8.687 12 10.8Z" />
    </svg>
  );
}

function RedditIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-[18px] h-[18px]" fill="currentColor" aria-hidden="true">
      <path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.701zM9.25 12C8.561 12 8 12.562 8 13.25c0 .687.561 1.248 1.25 1.248.687 0 1.248-.561 1.248-1.249 0-.688-.561-1.249-1.249-1.249zm5.5 0c-.687 0-1.248.561-1.248 1.25 0 .687.561 1.248 1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.687-.562-1.249-1.25-1.249zm-5.466 3.99a.327.327 0 0 0-.231.094.33.33 0 0 0 0 .463c.842.842 2.484.913 2.961.913.477 0 2.105-.056 2.961-.913a.361.361 0 0 0 .029-.463.33.33 0 0 0-.464 0c-.547.533-1.684.73-2.512.73-.828 0-1.979-.197-2.512-.73a.326.326 0 0 0-.232-.095z" />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-[18px] h-[18px]" fill="currentColor" aria-hidden="true">
      <path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227a3.81 3.81 0 0 1-.899 1.382 3.744 3.744 0 0 1-1.38.896c-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 1 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 1 1 0 8zm7.846-10.405a1.44 1.44 0 0 1-2.88 0 1.44 1.44 0 0 1 2.88 0z" />
    </svg>
  );
}

export default function ShareBox({ title, label = 'page' }: ShareBoxProps) {
  const [url, setUrl] = useState('');
  const [copied, setCopied] = useState(false);
  const [igCopied, setIgCopied] = useState(false);

  useEffect(() => {
    setUrl(window.location.href);
  }, []);

  const text = `${title} — PolishPal`;
  const enc = encodeURIComponent;

  const socials = [
    { name: 'Facebook', icon: <FacebookIcon />, href: `https://www.facebook.com/sharer/sharer.php?u=${enc(url)}`, hover: 'hover:bg-[#1877F2] hover:text-white hover:border-[#1877F2]' },
    { name: 'X', icon: <XIcon />, href: `https://twitter.com/intent/tweet?url=${enc(url)}&text=${enc(text)}`, hover: 'hover:bg-black hover:text-white hover:border-black' },
    { name: 'Bluesky', icon: <BlueskyIcon />, href: `https://bsky.app/intent/compose?text=${enc(text + ' ' + url)}`, hover: 'hover:bg-[#0085FF] hover:text-white hover:border-[#0085FF]' },
    { name: 'Reddit', icon: <RedditIcon />, href: `https://www.reddit.com/submit?url=${enc(url)}&title=${enc(title)}`, hover: 'hover:bg-[#FF4500] hover:text-white hover:border-[#FF4500]' },
  ];

  function copyLink() {
    navigator.clipboard?.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function shareInstagram() {
    // Instagram has no web share URL — copy the link so it can be pasted into a story/bio
    navigator.clipboard?.writeText(url);
    setIgCopied(true);
    setTimeout(() => setIgCopied(false), 2500);
  }

  function downloadPdf() {
    window.print();
  }

  return (
    <div className="no-print bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-4 my-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Share2 className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">Share this {label}</span>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            {socials.map((s) => (
              <a
                key={s.name}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                title={`Share on ${s.name}`}
                aria-label={`Share on ${s.name}`}
                className={`w-9 h-9 flex items-center justify-center rounded-full border border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 transition-colors ${s.hover}`}
              >
                {s.icon}
              </a>
            ))}
            <button
              onClick={shareInstagram}
              title="Copy link for Instagram"
              aria-label="Copy link for Instagram"
              className="w-9 h-9 flex items-center justify-center rounded-full border border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:bg-[#E4405F] hover:text-white hover:border-[#E4405F] transition-colors"
            >
              {igCopied ? <Check className="w-[18px] h-[18px]" /> : <InstagramIcon />}
            </button>
            <button
              onClick={copyLink}
              title="Copy link"
              aria-label="Copy link"
              className="w-9 h-9 flex items-center justify-center rounded-full border border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-colors"
            >
              {copied ? <Check className="w-[18px] h-[18px]" /> : <Link2 className="w-[18px] h-[18px]" />}
            </button>
          </div>
        </div>

        <button
          onClick={downloadPdf}
          className="flex items-center justify-center gap-2 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors shrink-0"
        >
          <Download className="w-4 h-4" />
          Download PDF
        </button>
      </div>
      {igCopied && (
        <p className="text-xs text-gray-400 dark:text-gray-500 mt-3">
          Link copied! Paste it into your Instagram story or bio.
        </p>
      )}
    </div>
  );
}
