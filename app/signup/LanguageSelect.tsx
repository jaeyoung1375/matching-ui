"use client";

import Select from "react-select";
import { useEffect, useState } from "react";
import { getLanguages } from "../features/auth/auth.query";

interface Option {
  value: string;
  label: string;
}

interface Props {
  onChange: (languages: string[]) => void;
}

export default function LanguageSelect({ onChange }: Props) {
  const [options, setOptions] = useState<Option[]>([]);
  const [selected, setSelected] = useState<Option[]>([]);

  useEffect(() => {
    async function loadLanguages() {
      const languages = await getLanguages();
      console.log(languages);
      const mapped = languages.map((lang: any) => ({
        value: lang.dtlCdId,
        label: lang.dtlCdNm,
      }));

      setOptions(mapped);
    }

    loadLanguages();
  }, []);

  const handleChange = (value: any) => {
    const selectedOptions = value ?? [];

    setSelected(selectedOptions);

    const ids = selectedOptions.map((item: Option) => item.value);

    onChange(ids); // 부모로 전달
  };

  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-neutral-700">
        관심분야
      </label>

      <Select
        instanceId="language-select"
        isMulti
        options={options}
        value={selected}
        onChange={handleChange}
        placeholder="관심분야 선택"
      />
    </div>
  );
}
