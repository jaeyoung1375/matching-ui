"use client";
import Input from "@/components/Input";
import SelectBox from "@/components/SelectBox";
import Button from "@/components/Button";
import { useAlertStore } from "@/store/alertStore";
import { useConfirmStore } from "@/store/confirmStore";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Test() {
  const router = useRouter();

  const [preview, setPreview] = useState<string>("");
  /** ALERT 선언 */
  const setAlert = useAlertStore((state) => state.setAlert);

  /** Confirm 선언 */
  const setConfirm = useConfirmStore((state) => state.setConfirm);

  const handleCreateImg = (e: any) => {
    const file = e.target.files[0];
    if (file) {
      const preview = URL.createObjectURL(file);
      setPreview(preview);
    }
  };

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
      <Button
        className="btn-primary"
        onClick={() => setAlert("알럿메시지입니다")}
      >
        팀원 모집하기
      </Button>
      <Button
        className="btn-white"
        onClick={() =>
          setConfirm(
            "정말삭제하시겠습니까?",
            () => router.push("/confirm"),
            () => router.push("/cancel"),
          )
        }
      >
        비지니스 문의
      </Button>
      <input type="file" onChange={handleCreateImg} />
      {preview && <img src={preview} />}
    </div>
  );
}
