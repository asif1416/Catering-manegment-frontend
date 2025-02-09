"use client";
import { notFound } from "next/navigation";
import { fetchMenuItem } from "@/api/menu";
import MenuItemDetails from "../MenuItemDetails";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { use, useEffect, useState } from "react";
import { MenuItem } from "@/types/types";

export default function MenuItemPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [menuItem, setMenuItem] = useState<MenuItem | null>(null);

  useEffect(() => {
    async function fetchData() {
      const fetchedMenuItem = await fetchMenuItem(id);
      if (!fetchedMenuItem) {
        notFound();
      } else {
        setMenuItem(fetchedMenuItem);
      }
    }
    fetchData();
  }, [id]);

  if (!menuItem) {
    return <div>Loading...</div>;
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
