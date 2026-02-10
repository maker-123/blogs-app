import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRef, useState } from "react";

interface Props {
  setImageFile: (file: File | null) => void;
}
const MAX_FILE_SIZE = 2 * 1024 * 1024;

const UploadImage = ({ setImageFile }: Props) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;

    if (file.size > MAX_FILE_SIZE) {
      alert("File is too large! Please choose an image under 2MB.");
      e.target.value = "";
      return;
    }

    if (!file.type.startsWith("image/")) {
      alert("Invalid file type. Please upload an image.");
      e.target.value = "";
      return;
    }

    setImageFile(file);
    setPreview(URL.createObjectURL(file));
  };
  const handleRemoveImage = () => {
    if (preview) URL.revokeObjectURL(preview);
    setPreview(null);
    setImageFile(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-semibold text-gray-600">Attachment</label>
      <input
        type="file"
        ref={fileInputRef}
        accept="image/png, image/jpeg"
        className="text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm  file:font-semibold file:bg-blue-50 file:text-blue-700  hover:file:bg-blue-100 cursor-pointer"
        onChange={handleFileChange}
      />
      <p className="text-sm text-gray-500">Max image size 2mb</p>
      {preview && (
        <div className="relative w-20 h-20">
          <img
            src={preview}
            className="h-20 w-20 object-cover rounded mt-2"
            alt=""
          />
          <button
            type="button"
            onClick={() => {
              handleRemoveImage();
            }}
            className="absolute -top-1 -right-3 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600 transition shadow-md"
          >
            <FontAwesomeIcon icon={faTimes} size="xs" />
          </button>
        </div>
      )}
    </div>
  );
};
export default UploadImage;
