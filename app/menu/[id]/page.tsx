import { notFound } from "next/navigation";
import { fetchMenuItem } from "@/api/menu";
import MenuItemDetails from "../MenuItemDetails";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { PageProps } from "@/types/types";

export default async function MenuItemPage({ params }:  PageProps ) {
  const menuItem = await fetchMenuItem(params.id);

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
