import { notFound } from "next/navigation";
import { fetchMenuItem } from "@/api/menu";
import MenuItemDetails from "../MenuItemDetails";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default async function MenuItemPage({params,}: {
    params: { id: string };
}) {
    const { id } =  params;

    if (!id) {
        notFound();
    }

    const menuItem = await fetchMenuItem(id);

    if (!menuItem) {
        notFound();
    }

    return (
        <>
            <Navbar />
            <div className="mx-auto w-2/3">
                <MenuItemDetails menuItem={menuItem} />
            </div>
            <Footer />
        </>
    );
}