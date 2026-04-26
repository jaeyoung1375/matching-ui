import clsx from "clsx";
import { useState, useRef, useEffect } from "react";

interface Option {
  label: string;
  value: string;
  explain?: string;
}

interface Props {
  value?: string[];
  options: Option[];
  placeholder?: string;
  onChange?: (value: string[]) => void;
  className?: string;
}

export default function DropButton({
  value = [],
  options,
  placeholder = "선택",
  onChange,
  className,
}: Props) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const toggle = (v: string) => {
    if (value.includes(v)) {
      onChange?.(value.filter((i) => i !== v));
    } else {
      onChange?.([...value, v]);
      console.log("탈텐데");
    }

    console.log("value : ", value);
  };

  const label = () => {
    if (value.length === 0) return placeholder;

    return options
      .filter((o) => value.includes(o.value))
      .map((o) => o.label)
      .join(", ");
  };

  const tabs = [
    {
      ko: "프론트엔드",
      eng: "frontEnd",
    },
    {
      ko: "백엔드",
      eng: "backEnd",
    },
    {
      ko: "모바일",
      eng: "mobile",
    },
    {
      ko: "기타",
      eng: "etc",
    },
    {
      ko: "모두보기",
      eng: "ALL",
    },
  ];

  const [activeTab, setActiveTab] = useState<string>("frontEnd");

  /**
   * Option[] 데이터를 tab에 따라서 filter 가공한  목록
   * @returns Option[]
   */
  const optionsData = (): Option[] => {
    if (activeTab === "ALL") {
      return options;
    } else {
      return options.filter((item) => item.explain === activeTab);
    }
  };

  return (
    <div ref={ref} className={clsx("multi-select", className)}>
      <button
        type="button"
        className="w-full text-left select-primary border rounded-lg"
        onClick={() => setOpen(!open)}
      >
        <span className="text-gray-400">{label()}</span>
        <span className="text-right">▼</span>
      </button>

      {open && (
        <div className="dropdown">
          {/* 탭 영역 */}
          <ul className="flex gap-6 border-b pb-2 w-full text-sm font-medium">
            {tabs.map((tab) => (
              <li
                key={tab.eng}
                onClick={() => setActiveTab(tab.eng)}
                className={`cursor-pointer pb-2 ${activeTab === tab.eng ? " border-b-2 border-yellow-400" : ""}`}
              >
                {tab.ko}
              </li>
            ))}
          </ul>

          {/* 태그 영역 */}
          <div className="flex flex-wrap mt-4 gap-2 z-auto">
            {optionsData().map((option) => (
              <button
                key={option.value}
                type="button"
                className={`tag ${value.includes(option.value) ? "active" : ""}`}
                onClick={() => toggle(option.value)}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
