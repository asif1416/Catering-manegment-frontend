'use client'

import {FaFacebookF, FaTwitter, FaInstagram} from 'react-icons/fa'
import Image from 'next/image'
import bgImage from '@/public/images/footerBG.png'
import {Button} from "@/components/ui/button";
import {useRouter} from 'next/navigation'
import Link from "next/link";

const Footer = () => {
    const router = useRouter();

    const handleSignUp = () => {
        router.push('/auth/signup')
    }
    return (
      <footer>
        {/* Sign Up Section */}
        <div className="py-20 relative">
          <Image
            src={bgImage}
            alt="Background"
            layout="fill"
            objectFit="cover"
            quality={100}
          />
          <div className="absolute inset-0 bg-black/50" />
          <div className="container mx-auto text-center relative z-10">
            <h2 className="text-4xl font-bold text-white mb-6">
              SIGN UP FOR <span className="text-primary">FREE</span>
            </h2>
            <Button
              size="lg"
              color="primary"
              className="font-semibold"
              onClick={handleSignUp}
            >
              Sign Up
            </Button>
          </div>
        </div>

        {/* Footer Navigation */}
        <div className="bg-neutral-900 text-white py-12">
          <div className="container mx-auto px-4">
            <div className="text-center">
              <h3 className="text-2xl font-bold mb-8 text-primary">
                CULINARY ODYSSEY
              </h3>

              <nav className="mb-8">
                <ul className="flex flex-wrap justify-center gap-8">
                  <li>
                    <a
                      href="#"
                      className="hover:text-primary transition-colors"
                    >
                      Service
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="hover:text-primary transition-colors"
                    >
                      About Us
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="hover:text-primary transition-colors"
                    >
                      Contact Us
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="hover:text-primary transition-colors"
                    >
                      FAQs
                    </a>
                  </li>
                  <li>
                    <Link
                      href="/auth/signin"
                      className="hover:text-primary transition-colors"
                    >
                      Sign In
                    </Link>
                  </li>
                </ul>
              </nav>

              <div className="flex justify-center gap-6 mb-8">
                <a
                  href="#"
                  className="hover:text-primary transition-colors"
                  aria-label="Facebook"
                >
                  <FaFacebookF size={24} />
                </a>
                <a
                  href="#"
                  className="hover:text-primary transition-colors"
                  aria-label="Twitter"
                >
                  <FaTwitter size={24} />
                </a>
                <a
                  href="#"
                  className="hover:text-primary transition-colors"
                  aria-label="Instagram"
                >
                  <FaInstagram size={24} />
                </a>
              </div>

              <p className="text-neutral-400 text-sm">
                culinaryodyssey.com | All rights reserved
              </p>
            </div>
          </div>
        </div>
      </footer>
    );
}

export default Footer
