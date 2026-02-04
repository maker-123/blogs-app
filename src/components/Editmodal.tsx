import { useState, useEffect } from "react";
import { supabase } from "../services/supabaseClient";
import { Post } from "../types/blog.types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";

interface PostUpdateProps {
  isOpen: boolean;
  onClose: () => void;
  onPostUpdated: () => void;
  post: Post;
}

const PostUpdate = ({
  isOpen,
  onClose,
  onPostUpdated,
  post,
}: PostUpdateProps) => {
  const [title, setTitle] = useState(post.title);
  const [body, setBody] = useState(post.body);
  const [caption, setCaption] = useState(post.caption || "");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setTitle(post.title);
    setBody(post.body);
    setCaption(post.caption || "");
  }, [post]);

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(post.image_url);

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let finalImageUrl = post.image_url;

      if (imageFile) {
        if (post.image_url) {
          const oldPath = post.image_url.split("/").pop();
          await supabase.storage.from("blog-images").remove([oldPath!]);
        }

        const fileExt = imageFile.name.split(".").pop();
        const filePath = `${Math.random()}.${fileExt}`;
        await supabase.storage.from("blog-images").upload(filePath, imageFile);

        const { data } = supabase.storage
          .from("blog-images")
          .getPublicUrl(filePath);
        finalImageUrl = data.publicUrl;
      }

      const { error } = await supabase
        .from("posts")
        .update({ title, body, caption, image_url: finalImageUrl })
        .eq("id", post.id);

      if (error) throw error;
      onPostUpdated();
      onClose();
    } catch (error: any) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-xl font-bold text-gray-800">Edit Post</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl"
          >
            &times;
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <input
            className="w-full text-2xl font-bold border-none focus:ring-0 p-0"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />

          <textarea
            className="w-full h-40 border-none focus:ring-0 resize-none p-0 text-lg"
            value={body}
            onChange={(e) => setBody(e.target.value)}
            required
          />
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-gray-600">
              Change Photo
            </label>
            <input
              type="file"
              accept="image/*"
              className="text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  setImageFile(file);
                  setPreview(URL.createObjectURL(file)); // Show preview
                }
              }}
            />
            {preview && (
              <div className="relative w-20 h-20">
                <img
                  src={preview}
                  className="h-20 w-20 object-cover rounded mt-2"
                  alt=""
                />
                <button
                  type="button" // Important: prevents form submission
                  onClick={() => {
                    setPreview(null);
                    setImageFile(null);
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

          <div className="flex justify-end gap-3 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 font-semibold text-gray-600 hover:bg-gray-100 rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 font-semibold bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? "Saving..." : "Update Post"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PostUpdate;
