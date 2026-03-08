import Input from "@/components/Input";
import SelectBox, { SelectOption } from "../components/SelectBox";
import Button from "../components/Button";
import Editor from "../components/Editor";

export default function Page() {
  const option: SelectOption[] = [
    { label: "naver.com", value: "naver.com" },
    { label: "gmail.com", value: "gmail.com" },
    { label: "daum.net", value: "daum.net" },
    { label: "kakao.com", value: "kakao.com" },
  ];

  return (
    <div className="min-h-[1400px]">
      <Input />
      <div className="w-full">
        <SelectBox
          className="select-primary"
          options={option}
          placeholder="직무선택"
        />
      </div>

      <br />
      <Button className="btn-primary">팀원 모집하기</Button>
      <Button className="btn-white">비지니스 문의</Button>

      <Editor />
    </div>
  );
}
