import { NextResponse } from "next/server";

export async function GET() {
	try {
		const response = await fetch("getLatestYoutubeVideo");

		if (!response.ok) {
			throw new Error(`Failed to fetch YouTube data: ${response.statusText}`);
		}

		const data = await response.json();

		return NextResponse.json(data);
	} catch (error) {
		return NextResponse.json(
			{ error: "Failed to fetch YouTube data" },
			{ status: 500 }
		);
	}
}
