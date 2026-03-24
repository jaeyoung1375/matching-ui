import { fetchCodeList } from "@/features/code/code.api";
import PostRegister from "./postRegister";
import { CommonCode } from "@/features/common/commonCode";
import { codeToSelectOption } from "@/util/CommonUtil";

export default async function Page() {
  const codeList = await fetchCodeList([
    CommonCode.RECRUIT_TYPE,
    CommonCode.PROGRESS_TYPE,
    CommonCode.TECH_STACK,
    CommonCode.RECRUIT_POSIT_TYPE,
    CommonCode.CONTACT_METHOD,
  ]);

  const selectOptions = {
    recruit: codeToSelectOption(codeList.RECRUIT_TYPE_CD ?? []),
    progress: codeToSelectOption(codeList.PROGRESS_TYPE_CD ?? []),
    techStack: codeToSelectOption(codeList.TECH_STACK ?? []),
    recruitPosit: codeToSelectOption(codeList.RECRUIT_POSIT_TYPE_CD ?? []),
    contactMethod: codeToSelectOption(codeList.CONTACT_METHOD_CD ?? []),
  };

  return <PostRegister selectOptions={selectOptions} />;
}
