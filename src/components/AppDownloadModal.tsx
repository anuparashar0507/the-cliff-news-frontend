"use client";

import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

const APP_STORE_URL =
  "https://apps.apple.com/us/app/the-cliff-news-news-epaper/id6746549944";
const PLAY_STORE_URL =
  "https://play.google.com/store/apps/details?id=com.thecliffnews";

interface AppDownloadModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function AppDownloadModal({
  open,
  onOpenChange,
}: AppDownloadModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="text-center sm:text-center">
          <DialogTitle className="text-2xl">View on our mobile app</DialogTitle>
          <DialogDescription>
            Download The Cliff News app to view and save Highlights and NIT
            papers.
          </DialogDescription>
        </DialogHeader>
        <div className="mt-4 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <a
            href={APP_STORE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="transition-opacity hover:opacity-90"
            aria-label="Download on the App Store"
          >
            <Image
              src="/badges/app-store-badge.svg"
              alt="Download on the App Store"
              width={160}
              height={48}
              className="h-12 w-auto"
              unoptimized
            />
          </a>
          <a
            href={PLAY_STORE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="transition-opacity hover:opacity-90"
            aria-label="Get it on Google Play"
          >
            <Image
              src="/badges/google-play-badge.png"
              alt="Get it on Google Play"
              width={180}
              height={54}
              className="h-14 w-auto"
              unoptimized
            />
          </a>
        </div>
      </DialogContent>
    </Dialog>
  );
}
