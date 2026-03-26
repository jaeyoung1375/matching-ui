"use client";

import BaseModal from "../components/ui/modal/BaseModal";
import Link from "next/link";
import Button from "@/components/Button";

interface LoginModalProps {
  open: boolean;
  onClose: () => void;
}

function SocialLoginButton({
  label,
  bgClass,
  textClass = "text-black",
}: {
  label: string;
  bgClass: string;
  textClass?: string;
}) {
  return (
    <Button
      className={`flex h-16 w-full items-center justify-center rounded-full text-xl font-bold transition hover:opacity-90 ${bgClass} ${textClass}`}
    >
      {label}
    </Button>
  );
}

export default function LoginModal({ open, onClose }: LoginModalProps) {
  return (
    <BaseModal open={open} onClose={onClose} maxWidth="md">
      <div className="flex flex-col items-center text-center">
        <div className="mb-6 text-4xl font-extrabold tracking-tight text-neutral-900">
          Teamo
        </div>

        <p className="mt-5 whitespace-pre-line text-lg leading-8 text-neutral-700">
          같은 목표를 가진 사람들이 만나 팀을 만들고
          {"\n"}
          새로운 프로젝트를 시작하는 협업 플랫폼입니다!
        </p>
        <div className="mt-10 flex w-70 flex-col gap-4">
          <Link href="/login" onClick={onClose} className="w-full">
            <SocialLoginButton
              label="이메일로 로그인"
              bgClass="bg-blue-600"
              textClass="text-white"
            />
          </Link>

          <SocialLoginButton
            label="Google 로그인"
            bgClass="bg-white border border-neutral-300"
          />

          <SocialLoginButton
            label="Github 로그인"
            bgClass="bg-black"
            textClass="text-white"
          />

          <SocialLoginButton label="Kakao 로그인" bgClass="bg-[#FEE500]" />
        </div>
      </div>
    </BaseModal>
  );
}
