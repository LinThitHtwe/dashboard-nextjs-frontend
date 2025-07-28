import { Home, Scroll, Table } from "lucide-react";

import {
	Sidebar,
	SidebarContent,
	SidebarGroup,
	SidebarGroupContent,
	SidebarGroupLabel,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
} from "@/components/ui/sidebar";

const items = [
	{
		title: "Home",
		url: "/",
		icon: Home,
	},
	{
		title: "Products Datatable",
		url: "/admin/product",
		icon: Table,
	},
	{
		title: "Products Infinite Scroll",
		url: "/admin/infinite-scroll",
		icon: Scroll,
	},
];

export function AppSidebar() {
	return (
		<Sidebar>
			<SidebarContent className="bg-primary text-primary-foreground">
				<SidebarGroup>
					<SidebarGroupLabel className="text-primary-foreground">
						Application
					</SidebarGroupLabel>
					<SidebarGroupContent>
						<SidebarMenu>
							{items.map((item) => (
								<SidebarMenuItem key={item.title}>
									<SidebarMenuButton asChild>
										<a href={item.url}>
											<item.icon />
											<span>{item.title}</span>
										</a>
									</SidebarMenuButton>
								</SidebarMenuItem>
							))}
						</SidebarMenu>
					</SidebarGroupContent>
				</SidebarGroup>
			</SidebarContent>
		</Sidebar>
	);
}
