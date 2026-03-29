"use client";

import { useState } from "react";
import { v4 as uuidv4 } from "uuid";

/**
 * 게시물 작성 시 사용하는 임시 파일 키를 생성한다.
 * 한 번 생성되면 컴포넌트 생명주기 동안 유지된다.
 * @returns {string} UUID 기반 tempKey
 */
export const useTempKey = () => {
  const [tempKey] = useState(() => uuidv4());
  return tempKey;
};
