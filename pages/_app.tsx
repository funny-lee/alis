import "@/styles/globals.css";
import { ThemeProvider } from "next-themes";
import type { AppProps } from "next/app";
import "tailwindcss/tailwind.css";
export default function App({ Component, pageProps }: AppProps) {
	return (
		<ThemeProvider
			disableTransitionOnChange
			attribute="class"
			value={{ light: "light", dark: "dark" }}
			defaultTheme="system"
		>
			<Component {...pageProps} />
		</ThemeProvider>
	);
}
