import { FileText } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { ThemeToggle } from '@/components/ui/theme-toggle'

export default function Home() {
  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center px-6 py-20 gap-12 sm:px-20 overflow-x-hidden">
      <div className="flex flex-nowrap items-center justify-center gap-8 sm:gap-12">
        <svg
          className="h-16 w-16 sm:h-20 sm:w-20"
          viewBox="0 0 180 180"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <mask
            id="nextjs_icon_dark__mask0_408_139"
            style={{ maskType: 'alpha' }}
            maskUnits="userSpaceOnUse"
            x="0"
            y="0"
            width="180"
            height="180"
          >
            <circle cx="90" cy="90" r="90" fill="black" />
          </mask>
          <g mask="url(#nextjs_icon_dark__mask0_408_139)">
            <circle cx="90" cy="90" r="87" fill="black" stroke="white" strokeWidth="6" />
            <path
              d="M149.508 157.52L69.142 54H54V125.97H66.1136V69.3836L139.999 164.845C143.333 162.614 146.509 160.165 149.508 157.52Z"
              fill="url(#nextjs_icon_dark__paint0_linear_408_139)"
            />
            <rect
              x="115"
              y="54"
              width="12"
              height="72"
              fill="url(#nextjs_icon_dark__paint1_linear_408_139)"
            />
          </g>
          <defs>
            <linearGradient
              id="nextjs_icon_dark__paint0_linear_408_139"
              x1="109"
              y1="116.5"
              x2="144.5"
              y2="160.5"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="white" />
              <stop offset="1" stopColor="white" stopOpacity="0" />
            </linearGradient>
            <linearGradient
              id="nextjs_icon_dark__paint1_linear_408_139"
              x1="121"
              y1="54"
              x2="120.799"
              y2="106.875"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="white" />
              <stop offset="1" stopColor="white" stopOpacity="0" />
            </linearGradient>
          </defs>
        </svg>

        <h6 className="text-3xl font-bold">+</h6>

        <svg
          className="h-16 w-16 sm:h-20 sm:w-20"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 256 256"
        >
          <path fill="none" d="M0 0h256v256H0z" />
          <path
            fill="none"
            stroke="currentColor"
            strokeWidth="25"
            strokeLinecap="round"
            d="M208 128l-80 80M192 40L40 192"
          />
        </svg>
      </div>

      <div className="text-center max-w-xl mx-auto space-y-4">
        <h2 className="text-2xl font-bold">Welcome to your Next.js + shadcn/ui starter!</h2>
        <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300">
          This is a clean starter template. Start building your project by editing
          <code className="rounded bg-black/[.05] dark:bg-white/[.06] px-1 py-0.5 font-semibold">
            app/page.tsx
          </code>
          .
        </p>
      </div>

      <div className="flex flex-wrap gap-4 justify-center">
        <Button asChild>
          <a
            href="https://github.com/jaycodev/next-shadcn-starter"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2"
          >
            <svg fill="currentColor" viewBox="0 0 24 24" className="w-5 h-5">
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M12 0C5.372 0 0 5.373 0 12c0 5.303 3.438 9.8 8.205 11.387.6.113.82-.26.82-.577v-2.165c-3.338.727-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.744.083-.729.083-.729 1.205.084 1.84 1.236 1.84 1.236 1.07 1.834 2.807 1.304 3.492.997.108-.775.419-1.304.762-1.604-2.665-.305-5.466-1.334-5.466-5.933 0-1.31.468-2.38 1.236-3.22-.124-.303-.536-1.524.117-3.176 0 0 1.008-.322 3.3 1.23a11.51 11.51 0 0 1 3.003-.404c1.02.004 2.045.138 3.003.404 2.29-1.552 3.296-1.23 3.296-1.23.656 1.652.244 2.873.12 3.176.77.84 1.236 1.91 1.236 3.22 0 4.61-2.804 5.625-5.475 5.921.43.37.815 1.096.815 2.21v3.277c0 .32.218.694.825.576C20.565 21.796 24 17.303 24 12c0-6.627-5.373-12-12-12z"
              />
            </svg>
            GitHub
          </a>
        </Button>

        <Button variant="outline" asChild>
          <a
            href="https://github.com/jaycodev/next-shadcn-starter#readme"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2"
          >
            <FileText />
            Readme
          </a>
        </Button>
      </div>

      <div className="fixed bottom-4 right-4 sm:bottom-8 sm:right-8">
        <ThemeToggle />
      </div>
    </main>
  )
}
