export default function RootLayout({
	children,
}: {
	children: React.ReactNode
}) {
	return (
		<html lang="en">
			<head>
				<link rel="icon" href="@/public/favicon.ico" />
			</head>
			<body style={{ margin: 0 }}>{children}</body>
		</html>
	)
}
