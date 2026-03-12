import Image from "next/image";
import Link from "next/link";
import { ReactNode } from "react";

interface AuthLayoutProps {
  title: string;
  description?: string;
  children: ReactNode;
}

export default function AuthLayout({
  title,
  description,
  children,
}: AuthLayoutProps) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-neutral-50 px-4 py-10">
      <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-sm sm:p-10">
        <div className="mb-8 flex flex-col items-center">
          <Link href="/" className="mb-6">
            <Image
              src="/logo.svg"
              alt="logo"
              width={40}
              height={20}
              priority
              className="h-auto w-auto"
            />
          </Link>

          <h1 className="text-center text-3xl font-bold text-neutral-900">
            {title}
          </h1>

          {description && (
            <p className="mt-3 text-center text-sm leading-6 text-neutral-500">
              {description}
            </p>
          )}
        </div>

        {children}
      </div>
    </div>
  );
}
