"use client";
import Input from "@/components/Input";
import SelectBox from "../components/SelectBox";
import Button from "../components/Button";
import Editor from "../components/Editor";
import { useCodeQuery } from "../features/code/code.query";

export default function Test() {
  return (
    <div className="min-h-[1400px]">
      <Input />
      <div className="w-full">
        <SelectBox
          className="select-primary"
          options={[]}
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
