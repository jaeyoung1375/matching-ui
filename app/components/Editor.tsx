"use client";
import "@/styles/editor.css";

import { EditorContent, useEditor } from "@tiptap/react";
import Image from "@tiptap/extension-image";
import StarterKit from "@tiptap/starter-kit";
import React, { useState } from "react";

export default function Editor() {
  const [, forceUpdate] = useState(0);
  const editor = useEditor({
    extensions: [StarterKit, Image],
    content: "<p></p>",
    immediatelyRender: false,
    onUpdate: () => forceUpdate((v) => v + 1),
    onSelectionUpdate: () => forceUpdate((v) => v + 1),
    editorProps: {
      attributes: {
        class: "focus:outline-none",
      },
    },
  });

  if (!editor) return null;
  const btn = (active?: boolean) =>
    `px-2 py-1 text-sm rounded-md border transition
     ${
       active
         ? "bg-gray-900 text-white border-gray-900"
         : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
     }`;

  /** 이미지 추가 버튼 */
  const addImage = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = () => {
      if (typeof reader.result === "string") {
        editor?.chain().focus().setImage({ src: reader.result }).run();
      }
    };

    reader.readAsDataURL(file);
  };

  return (
    <div className="border border-black-200 rounded-lg bg-white h-[600px]">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-1 p-2 border-b bg-gray-50">
        <button
          className={btn(editor.isActive("bold"))}
          onClick={() => editor.chain().focus().toggleBold().run()}
        >
          B
        </button>
        <button
          className={btn(editor.isActive("italic"))}
          onClick={() => editor.chain().focus().toggleItalic().run()}
        >
          I
        </button>
        <button
          className={btn(editor.isActive("strike"))}
          onClick={() => editor.chain().focus().toggleStrike().run()}
        >
          S
        </button>

        <div className="w-px h-5 bg-gray-300 mx-1" />

        <button
          className={btn(editor.isActive("paragraph"))}
          onClick={() => editor.chain().focus().setParagraph().run()}
        >
          P
        </button>
        {([1, 2, 3] as const).map((level) => (
          <button
            key={level}
            className={btn(editor.isActive("heading", { level }))}
            onClick={() =>
              editor.chain().focus().toggleHeading({ level }).run()
            }
          >
            H{level}
          </button>
        ))}

        <div className="w-px h-5 bg-gray-300 mx-1" />

        <button
          className={btn(editor.isActive("bulletList"))}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
        >
          • List
        </button>
        <button
          className={btn(editor.isActive("orderedList"))}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
        >
          1. List
        </button>
        <label className={btn()}>
          Image
          <input type="file" accept="image/*" onChange={addImage} hidden />
        </label>

        <div className="w-px h-5 bg-gray-300 mx-1" />

        <button
          className={btn(editor.isActive("blockquote"))}
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
        >
          ❝
        </button>
        <button
          className={btn(editor.isActive("code"))}
          onClick={() => editor.chain().focus().toggleCode().run()}
        >
          {"</>"}
        </button>
        <button
          className={btn(editor.isActive("codeBlock"))}
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
        >
          Code
        </button>

        <div className="w-px h-5 bg-gray-300 mx-1" />

        <button
          className={btn(false)}
          onClick={() => editor.chain().focus().undo().run()}
        >
          Undo
        </button>
        <button
          className={btn(false)}
          onClick={() => editor.chain().focus().redo().run()}
        >
          Redo
        </button>
      </div>

      {/* Editor */}
      <div className="max-w-none p-4">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}
