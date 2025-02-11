"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import foodBG from "@/public/images/foodBG.png";
import bg1 from "@/public/images/bg1.png";
import bg2 from "@/public/images/bg2.jpg";
import bg3 from "@/public/images/bg3.jpg";

import { useAuthStore } from "@/store/auth-store";
import debounce from "lodash.debounce";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import MenuCards from "@/components/MenuCards";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

import { fetchMenuData, searchMenuItems } from "@/api/home";
import toast from "react-hot-toast";
import { FaApple, FaGooglePlay } from "react-icons/fa";
import Loader from "@/components/Loader";

export default function Home() {
  const { logout, checkAuth } = useAuthStore();

  const [menuData, setMenuData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchResults, setSearchResults] = useState([]);
  const [error, setError] = useState(null);

  const carouselImages = [
    { src: bg1, alt: "Image 1" },
    { src: bg2, alt: "Image 2" },
    { src: bg3, alt: "Image 3" },
  ];

  useEffect(() => {
    const initializeAuth = async () => {
      const authenticated = await checkAuth();
      if (!authenticated) {
        logout();
      }
    };

    initializeAuth();
  }, [checkAuth, logout]);

  useEffect(() => {
    async function fetchMenu() {
      try {
        const data = await fetchMenuData();
        setMenuData(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchMenu();
  }, []);

  const handleSearch = useCallback(
    debounce(async (searchTerm: string) => {
      if (searchTerm.length >= 1) {
        try {
          const data = await searchMenuItems(searchTerm);
          setSearchResults(data);
        } catch (err: any) {
          toast.error(err.message);
        }
      } else {
        setSearchResults([]);
      }
    }, 300),
    []
  );

  return (
    <>
      <Navbar />
      <main className="min-h-screen">
        <section className="container mx-auto my-8">
          <Carousel className="w-full max-w-6xl mx-auto">
            <CarouselContent>
              {carouselImages.map((item, index) => (
                <CarouselItem key={index}>
                  <div className="p-1">
                    <Image
                      src={item.src}
                      alt={item.alt}
                      width={800}
                      height={400}
                      className="w-full h-[400px] object-cover rounded-lg"
                    />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </section>
        <section className="container mx-auto w-11/12 lg:w-9/12 p-5 bg-white rounded-lg shadow-lg mt-10">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <h2 className="text-primary text-2xl font-bold">Our meal plans</h2>
            <div className="w-full md:w-auto">
              <form
                className="flex w-full max-w-sm items-center space-x-2"
                onSubmit={(e) => e.preventDefault()}
              >
                <Input
                  type="search"
                  placeholder="Search meal plans"
                  onChange={(e) => handleSearch(e.target.value)}
                />
              </form>
            </div>
          </div>
          <div className="mt-2 border-t border-primary" />
          {loading ? (
            <div>
              <Loader />
            </div>
          ) : error ? (
            <p className="text-red-500">Error: {error}</p>
          ) : (
            <MenuCards
              cards={searchResults.length > 0 ? searchResults : menuData}
            />
          )}
        </section>
        <section className="py-16 mt-40 relative">
          <Image
            src={foodBG || "/placeholder.svg"}
            alt="Food Background"
            layout="fill"
            objectFit="cover"
            quality={100}
          />
          <div className="absolute inset-0 bg-white/80" />
          <div className="container mx-auto text-center relative z-10">
            <h2 className="text-3xl font-bold mb-8">
              <span className="text-primary">DOWNLOAD</span>
              <span className="ml-2 text-neutral-600">THE APP</span>
            </h2>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button
                variant="secondary"
                className="inline-flex items-center px-6 py-3"
                asChild
              >
                <a href="#">
                  <FaGooglePlay className="mr-2" />
                  Get it on Android
                </a>
              </Button>
              <Button
                variant="secondary"
                className="inline-flex items-center px-6 py-3"
                asChild
              >
                <a href="#">
                  <FaApple className="mr-2" />
                  Get it on iOS
                </a>
              </Button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
