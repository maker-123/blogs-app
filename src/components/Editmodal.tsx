import { useState, useEffect } from "react";
import { supabase } from "../services/supabaseClient";
import { Post } from "../types/blog.types";
import UploadImage from "./UploadImage";

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
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setTitle(post.title);
    setBody(post.body);
  }, [post]);

  const [imageFile, setImageFile] = useState<File | null>(null);

  const handleUploadImage = async () => {
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
      return data.publicUrl;
    }
  };

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let finalImageUrl = (await handleUploadImage()) ?? post.image_url;

      const { error } = await supabase
        .from("posts")
        .update({ title, body, image_url: finalImageUrl })
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
            className="w-full text-2xl font-bold border-none focus:ring-0 placeholder-gray-300 p-2"
            type="text"
            placeholder="Post Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            maxLength={50}
            required
          />
          <p className="text-sm text-gray-500">{title.length}/50</p>
          <textarea
            className="w-full h-40 border-none focus:ring-0 resize-none p-2 text-lg"
            placeholder="Write your content..."
            value={body}
            maxLength={200}
            onChange={(e) => setBody(e.target.value)}
            required
          />
          <p className="text-sm text-gray-500">{body.length}/200</p>

          {/* upload */}
          <UploadImage setImageFile={setImageFile} />

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
              {loading ? "Saving..." : "Update Post"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PostUpdate;
