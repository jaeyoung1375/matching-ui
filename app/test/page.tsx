import Input from "@/components/Input";
import SelectBox, { SelectOption } from "../components/SelectBox";
import Button from "../components/Button";

export default function Page() {
  const option: SelectOption[] = [
    { label: "선택", value: "" },
    { label: "naver.com", value: "naver.com" },
    { label: "gmail.com", value: "gmail.com" },
    { label: "daum.net", value: "daum.net" },
    { label: "kakao.com", value: "kakao.com" },
  ];

  return (
    <>
      <Input />
      <SelectBox options={option} />
      <div>
        <Button className="w-full">회원가입</Button>
      </div>
      <br />
      <div>
        <Button className="w-1/2">회원가입</Button>
      </div>
      <br />
      <Button className="w-fit">회원가입</Button>
    </>
  );
}
