import SideBar from "@/components/SideBar";

export default function Layout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return <main className="flex w-full h-screen">
        <SideBar />
        {children}
    </main>;
}
