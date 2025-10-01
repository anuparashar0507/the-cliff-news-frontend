import Link from "next/link";

const Footer = () => {
  return (
    <footer className="border-t border-border bg-card">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">
                  TC
                </span>
              </div>
              <span className="font-bold text-xl text-foreground">
                The Cliff News
              </span>
            </div>
            <p className="text-muted-foreground text-sm">
              Your trusted source for the latest breaking news, politics,
              entertainment, sports, and more.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/inshorts"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Quick Reads
                </Link>
              </li>
              <li>
                <Link
                  href="/videos"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Videos
                </Link>
              </li>
              <li>
                <Link
                  href="/highlights"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Highlights
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground">Categories</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/category/politics"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Politics
                </Link>
              </li>
              <li>
                <Link
                  href="/category/entertainment"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Entertainment
                </Link>
              </li>
              <li>
                <Link
                  href="/category/sports"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Sports
                </Link>
              </li>
              <li>
                <Link
                  href="/category/business"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Business
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground">Contact</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/about"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Contact
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border mt-8 pt-8 text-center">
          <p className="text-muted-foreground text-sm">
            &copy; 2024 The Cliff News. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
