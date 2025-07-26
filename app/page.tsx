"use client";
import { Button } from "@/components/ui/button";

export default function Home() {
	return (
		<div className="flex flex-col items-center justify-center min-h-screen p-4">
			<Button
				onClick={() => {
					console.log("Clicked");
				}}>
				Click me
			</Button>
		</div>
	);
}
