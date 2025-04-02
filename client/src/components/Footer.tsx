import { Link } from 'wouter';
import { Earth, Github, Twitter, MessageSquare } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-muted py-8 mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center mb-4 md:mb-0">
            <Earth className="h-5 w-5 text-primary mr-2" />
            <span className="font-display font-bold text-lg">Earth<span className="text-accent">shout</span></span>
            <span className="ml-3 text-muted-foreground text-sm">© {new Date().getFullYear()}</span>
          </div>
          <div className="flex space-x-6">
            <a href="https://github.com" className="text-muted-foreground hover:text-foreground transition-colors duration-200" target="_blank" rel="noopener noreferrer">
              <Github className="h-5 w-5" />
            </a>
            <a href="https://twitter.com" className="text-muted-foreground hover:text-foreground transition-colors duration-200" target="_blank" rel="noopener noreferrer">
              <Twitter className="h-5 w-5" />
            </a>
            <a href="https://discord.com" className="text-muted-foreground hover:text-foreground transition-colors duration-200" target="_blank" rel="noopener noreferrer">
              <MessageSquare className="h-5 w-5" />
            </a>
          </div>
          <div className="mt-4 md:mt-0 text-muted-foreground text-sm">
            <Link href="/terms" className="hover:text-foreground mr-4">
              Terms of Service
            </Link>
            <Link href="/privacy" className="hover:text-foreground">
              Privacy Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
