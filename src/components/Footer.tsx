import { Link } from "react-router-dom";
import {
  Facebook,
  Twitter,
  Instagram,
  Youtube,
  Github,
  Linkedin,
} from "lucide-react";
import Logo from "@/assets/Logo.png";


export default function Footer() {
  return (
    <footer className="bg-card border-t border-border mt-auto">
      <div className="container mx-auto px-4 py-12">
        {/* Main Grid: 
            - On mobile (default), it's 1 column wide.
            - On medium screens (md), it's 4 columns wide. 
        */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* About Section (Takes 1 column on mobile, 2 on desktop) */}
          <div className="col-span-1 md:col-span-2">
            <Link to="/">
              <div className="flex gap-4 align-center text-center md:text-left  cursor-pointer hover:text-primary">
                 <img src={Logo} alt="AniShow Logo" className="h-10 mb-4 text-center item" />{" "} 
                <h3 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-4 text-white hover:text-primary">
                AniShow
              </h3>
              </div>
            </Link>

            <p className="text-muted-foreground mb-4">
              Your ultimate destination for watching the latest and greatest
              anime series. Stream thousands of episodes in high quality with
              multiple language options.
            </p>
            <div className="flex gap-4">
              <a
                href="https://www.instagram.com/raju_vishwa.karma/"
                target="blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                <Instagram className="h-5 w-5" />
              </a>

              <a
                href="https://github.com/Raju-kumar-vishwakarma"
                target="blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                <Github className="h-5 w-5" />
              </a>
              <a
                href="https://www.linkedin.com/in/raju-kumar-a134b9342/"
                target="blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>
          {/* Links Section Wrapper: 
              - On mobile (default), it's a 2-column grid to put Quick Links and Legal side-by-side.
              - On medium screens (md), the columns break out into the main 4-column grid.
          */}
          <div className="grid grid-cols-2 gap-8 col-span-1 md:col-span-2 md:grid-cols-2">
            {/* Quick Links */}
            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li>
                  <Link
                    to="/"
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    Home
                  </Link>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    Browse Anime
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    Popular
                  </a>
                </li>
                <li>
                  <a href="/"
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    New Releases
                  </a>
                </li>
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2">
                <li>
                  <a
                    href="#"
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    Terms of Service
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    DMCA
                  </a>
                </li>
                <li>
                  <Link
                    to="/contact"
                    className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-2"
                  >
                    Contact Us
                  </Link>
                </li>
              </ul>
            </div>
          </div>{" "}
          {/* End of Links Section Wrapper */}
        </div>

        <div className="border-t border-border mt-8 pt-8 text-center text-muted-foreground">
          <p>&copy; 2025 AniShow. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
