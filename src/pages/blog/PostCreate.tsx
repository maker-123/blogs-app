import { useRef, useState } from "react";
import { supabase } from "../../services/supabaseClient";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";

interface PostCreateProps {
  isOpen: boolean;
  onClose: () => void;
  onPostCreated: () => void;
}

const PostCreate = ({ isOpen, onClose, onPostCreated }: PostCreateProps) => {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [caption, setCaption] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const uploadImage = async (file: File) => {
    const fileExt = file.name.split(".").pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from("blog-images")
      .upload(filePath, file);

    if (uploadError) throw uploadError;

    const { data } = supabase.storage
      .from("blog-images")
      .getPublicUrl(filePath);
    console.log(data);
    return data.publicUrl;
  };

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let imageUrl = null;
      if (imageFile) imageUrl = await uploadImage(imageFile);

      const { error } = await supabase
        .from("posts")
        .insert([{ title, body, caption, image_url: imageUrl }]);

      if (error) throw error;

      setTitle("");
      setBody("");
      setCaption("");
      setImageFile(null);
      setPreview(null);

      onPostCreated();
      onClose();
    } catch (error: any) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  const MAX_FILE_SIZE = 2 * 1024 * 1024;

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

  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      {/* Modal Card */}
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-xl font-bold text-gray-800">Create New Post</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl"
          >
            &times;
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <input
            className="w-full text-2xl font-bold border-none focus:ring-0 placeholder-gray-300 p-0"
            type="text"
            placeholder="Post Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            maxLength={50}
            required
          />
          <p className="text-sm text-gray-500">{title.length}/50</p>
          <textarea
            className="w-full h-40 border-none focus:ring-0 resize-none p-0 text-lg"
            placeholder="Write your content..."
            value={body}
            maxLength={200}
            onChange={(e) => setBody(e.target.value)}
            required
          />
          <p className="text-sm text-gray-500">{body.length}/200</p>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-gray-600">
              Attachment
            </label>
            {/*<input
              type="file"
              accept="image/*"
              className="text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              onChange={(e) => {
                setImageFile(e.target.files ? e.target.files[0] : null);
                setPreview(URL.createObjectURL(e.target.files?.[0] as File));
              }}
            />*/}
            <input
              type="file"
              ref={fileInputRef} // Add the ref here
              accept="image/png, image/jpeg"
              className="text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 
             file:rounded-full file:border-0 file:text-sm 
             file:font-semibold file:bg-blue-50 file:text-blue-700 
             hover:file:bg-blue-100 cursor-pointer"
              onChange={handleFileChange}
            />
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

          {/*<textarea
            className="w-full border-none focus:ring-0 resize-none p-0 text-sm text-gray-500"
            placeholder="Add a caption..."
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
          ></textarea>*/}

          {/* Footer Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 font-semibold text-gray-600 hover:bg-gray-100 rounded-lg transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 font-semibold bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
            >
              {loading ? "Posting..." : "Create Post"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PostCreate;
