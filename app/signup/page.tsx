import AuthLayout from "@/app/signup/AuthLayout";
import SignupForm from "./SignupForm";

export default function SignupPage() {
  return (
    <AuthLayout
      title="회원가입"
      description="간단한 정보 입력 후 회원가입을 진행하세요."
    >
      <SignupForm />
    </AuthLayout>
  );
}
