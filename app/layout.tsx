import './globals.css'
import { ClerkProvider } from '@clerk/nextjs'
export default function RootLayout({ children }: { children: React.ReactNode }) {
	const hasClerk = !!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
	if (hasClerk) {
		return (
			<ClerkProvider>
				<html lang="en" suppressHydrationWarning>
					<body className="min-h-dvh bg-background text-foreground">{children}</body>
				</html>
			</ClerkProvider>
		)
	}
	return (
		<html lang="en" suppressHydrationWarning>
			<body className="min-h-dvh bg-background text-foreground">{children}</body>
		</html>
	)
}
