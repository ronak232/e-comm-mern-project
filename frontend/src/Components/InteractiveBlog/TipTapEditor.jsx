import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Color } from "@tiptap/extension-color";
import FontFamily from "@tiptap/extension-font-family";
import Image from "@tiptap/extension-image";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import TextStyle from "@tiptap/extension-text-style";
import ImageResize from "tiptap-extension-resize-image";
import { useEffect, useState } from "react";
import { uploadToCloudinary } from "../../hooks/context/cloudinary/postImageToCloudinary";

export const TipTapEditor = ({
  onContentChange,
  userBlogContent,
  coverImage,
  onCoverImageChange,
}) => {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        history: false,
        heading: {
          levels: [1, 2, 3, 4, 5],
        },
        bold: {
          HTMLAttributes: {
            class: "text-bold",
          },
        },
      }),
      Image.configure({
        allowBase64: true,
        inline: true,
      }),
      ImageResize,
      Underline,
      TextAlign.configure({
        alignments: ["left", "right", "center"],
        types: ["heading", "paragraph"],
      }),
      Color.configure({
        types: ["textStyle"],
      }),
      TextStyle,
      FontFamily.configure({
        types: ["textStyle"],
      }),
    ],

    content: userBlogContent || "",
    onUpdate: ({ editor }) => {
      const updatedContent = editor.getHTML();
      onContentChange(updatedContent);
    },
  });
  const [isDropdownOpen, setDropdownOpen] = useState(false);

  const [showColorBox, setShowColorBox] = useState(false);

  const [fontFamilyMenu, setfontFamilyMenu] = useState(false);

  const [imageUrl, setImageUrl] = useState("");

  const [blogTitle, setBlogTitle] = useState("");

  const [error, setError] = useState(null);

  const [colorChoice, setColorChoice] = useState({
    currentColor: "#000000", // Default selected color
    colors: [
      { color: "#000000", name: "Black" },
      { color: "#0077cd", name: "Blue" },
      { color: "#fe3638", name: "Red" },
      { color: "#ffa500", name: "Orange" },
      { color: "#12b0a5cc", name: "Green" },
      { color: "#00FF7F", name: "SpringGreen" },
    ],
  });

  const [selectFontFamily, setSelectFontFamily] = useState({
    default: "Arial",
    fontFamilyOptions: [
      { label: "Arial", value: "Arial" },
      { label: "Times New Roman", value: "Times New Roman" },
      { label: "Comic Sans MS", value: "Comic Sans MS" },
      { label: "serif", value: "serif" },
      { label: "sans-serif", value: "sans-serif" },
      { label: "Cursive", value: "cursive" },
    ],
  });

  let heading = [
    { label: "Heading 1", value: 1, fontSize: "32px" },
    { label: "Heading 2", value: 2, fontSize: "28px" },
    { label: "Heading 3", value: 3, fontSize: "20px" },
    { label: "Heading 4", value: 4, fontSize: "18px" },
    { label: "Heading 5", value: 5, fontSize: "16px" },
  ];

  const toggleDropdown = () => {
    setDropdownOpen((prev) => !prev);
  };

  const selectHeading = (value) => {
    editor.chain().focus().setHeading({ level: value }).run();
    setDropdownOpen(false); // Close dropdown after selection
  };

  const onChange = (image) => {
    if (editor) {
      editor.chain().focus().setImage({ src: image }).run();
    }
  };

  const handleCoverImage = async (e) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const cloudinaryUrl = await uploadToCloudinary(
          "https://api.cloudinary.com/v1_1/dwc1sjsvj/image/upload",
          file
        );
        console.log("type of ", cloudinaryUrl);
        onCoverImageChange(cloudinaryUrl);
      } catch (err) {}
    }
  };

  const imageUpload = async () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.value = imageUrl || "";
    input.onchange = async (e) => {
      const file = e.target.files?.[0];
      if (file) {
        try {
          const cloudinaryUrl = await uploadToCloudinary(
            "https://api.cloudinary.com/v1_1/dwc1sjsvj/image/upload",
            file
          );
          setImageUrl(cloudinaryUrl);
          onChange(cloudinaryUrl);
        } catch {
          setError("Failed to upload");
        }
      }
    };
    input.click();
  };

  const MyFontFamily = () => {
    const toggleFontFamily = (font) => {
      if (editor) {
        editor.chain().focus().setFontFamily(font).run();
        setSelectFontFamily((prev) => ({
          ...prev,
          default: font,
        }));
        setfontFamilyMenu(false);
      }
    };

    const toggleFontFamilyTray = () => {
      setfontFamilyMenu(!fontFamilyMenu);
    };

    return (
      <>
        <div className="relative ff-controller">
          {fontFamilyMenu && (
            <div
              className={`absolute blog-editor-controls-ffdropdown ${
                fontFamilyMenu ? "show" : ""
              }`}
            >
              <ul>
                {Array.isArray(selectFontFamily.fontFamilyOptions) &&
                  selectFontFamily.fontFamilyOptions.map(({ label, value }) => {
                    return (
                      <li
                        onClick={() => toggleFontFamily(value)}
                        className={
                          editor.isActive("fontFamily", { fontFamily: value })
                            ? "active"
                            : "cursor-pointer pb-2 text-black p-2"
                        }
                        style={{ fontFamily: value }}
                      >
                        {label}
                      </li>
                    );
                  })}
              </ul>
            </div>
          )}
          <button
            className="h-full"
            type="button"
            onClick={toggleFontFamilyTray}
          >
            {selectFontFamily.default}
          </button>
        </div>
      </>
    );
  };

  const TextColor = () => {
    const handleColorChange = (color) => {
      setColorChoice((prev) => ({
        ...prev,
        currentColor: color,
      }));
      if (editor) {
        editor.chain().focus().setColor(color).run();
        setShowColorBox(false);
      }
    };

    const toggleColorTray = () => {
      setShowColorBox(!showColorBox);
    };

    return (
      <div className="relative h-full">
        {showColorBox && (
          <div className="color-choice">
            {colorChoice.colors.map(({ color, name }) => (
              <span
                key={name}
                className={`w-[35px] h-[35px] block ${
                  colorChoice.currentColor === color
                    ? "border-2 border-white"
                    : ""
                }`}
                style={{ backgroundColor: color }}
                onClick={() => handleColorChange(color)}
              ></span>
            ))}
          </div>
        )}
        <button
          type="button"
          onClick={toggleColorTray}
          className="w-[35px] min-h-full"
          style={{
            background:
              colorChoice.colors?.find((item) =>
                editor.isActive("fontFamily", { level: item.value })
              )?.label || colorChoice.currentColor,
          }}
        ></button>
      </div>
    );
  };

  useEffect(() => {
    if (editor) {
      const currentColor =
        editor.getAttributes("textStyle")?.color || "#000000";
      setColorChoice((prev) => ({
        ...prev,
        currentColor,
      }));
    }
  }, [editor]);

  if (!editor) return null;

  return (
    <>
      <div className="mt-3 flex">
        <label className="text-sm font-medium text-gray-700">
          Upload Cover Image
        </label>
        <input
          type="file"
          accept="image/*"
          name="coverImage"
          onChange={handleCoverImage}
        />
        {coverImage && (
          <img
            src={coverImage}
            alt="Cover"
            className="mt-3 sm:max-w-[120px] sm:min-w-[100px] h-auto rounded-lg"
          />
        )}
      </div>
      <div className="blog-editor flex flex-wrap justify-evenly gap-4 items-stretch">
        <div className="flex gap-2 relative flex-1 justify-start blog-editor-controls ">
          <MyFontFamily />
          <div className="">
            <button
              type="button"
              className="h-full heading-btn"
              onClick={toggleDropdown}
            >
              {heading.find((item) =>
                editor.isActive("heading", { level: item.value })
              )?.label || "H"}
            </button>
            {isDropdownOpen && (
              <ul className="absolute top-10 w-full z-40 p-2 rounded-xl bg-white flex flex-col gap-1 max-w-[150px] shadow-md">
                {heading.map((item) => {
                  return (
                    <li
                      onClick={() => selectHeading(item.value)}
                      className={
                        editor.isActive("heading", { level: item.value })
                          ? "active"
                          : "cursor-pointer pb-2 text-black"
                      }
                    >
                      {item.label}
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={editor.isActive("bold") ? "active" : "h-full"}
            title="bold"
          >
            <img className="blog-editor-icons" src="/images/bold.svg" alt="" />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={editor.isActive("italic") ? "active" : ""}
            title="italic"
          >
            <img
              className="blog-editor-icons"
              src="/images/italic.svg"
              alt=""
            />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            className={editor.isActive("underline") ? "active" : ""}
            title="underline"
          >
            <img
              className="blog-editor-icons"
              src="/images/underline.svg"
              alt=""
            />
          </button>
        </div>
        <div className="flex gap-2 flex-1 ">
          <TextColor />
          <button
            type="button"
            className={editor.isActive({ textAlign: "center" }) ? "active" : ""}
            onClick={() => editor.chain().focus().setTextAlign("center").run()}
            title="align-items"
          >
            <img
              className="blog-editor-icons"
              src="/images/align-center.svg"
              alt="align-center"
            />
          </button>
          <button
            type="button"
            className={editor.isActive({ textAlign: "left" }) ? "active" : ""}
            onClick={() => editor.chain().focus().setTextAlign("left").run()}
          >
            <img
              className="blog-editor-icons"
              src="/images/align-left.svg"
              alt=""
            />
          </button>
          <button
            type="button"
            className={editor.isActive({ textAlign: "right" }) ? "active" : ""}
            onClick={() => editor.chain().focus().setTextAlign("right").run()}
          >
            <img
              className="blog-editor-icons"
              src="/images/align-right.svg"
              alt=""
            />
          </button>
          <button type="button" className="" onClick={imageUpload}>
            <img src="/images/image-upload.png" alt="" />
          </button>
        </div>
      </div>
      <input
        name="title"
        className="ps-2 pe-2 pt-3 pb-3 rounded-lg text-black text-xl"
        type="text"
        value={blogTitle}
        onChange={(e) => setBlogTitle(e.target.value)}
        placeholder="Write blog title..."
      />
      <div className="flex min-h-[400px] max-h-[100%] bg-white border-[2px] border-cyan-300 focus:none rounded-lg">
        {/* Editor Content */}
        <EditorContent
          editor={editor}
          className="max-h-full w-full"
          draggable
        />
      </div>
    </>
  );
};
