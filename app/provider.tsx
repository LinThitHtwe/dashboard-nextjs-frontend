"use client";
import { AppSidebar } from "@/components/app-sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactNode, useState } from "react";

const Provider = ({ children }: { children: ReactNode }) => {
	const [queryClient] = useState(() => new QueryClient());
	return (
		<>
			<QueryClientProvider client={queryClient}>
				<SidebarProvider>{children}</SidebarProvider>
			</QueryClientProvider>
		</>
	);
};

export default Provider;
