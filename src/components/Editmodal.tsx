import { useState } from "react";
import { supabase } from "../services/supabaseClient";
import { Post } from "../types/blog.typs";
interface EditModalProps {
  post: Post;
  onClose: () => void;
  onUpdate: (updatedPost: Post) => void;
}

const EditModal = ({ post, onClose, onUpdate }: EditModalProps) => {
  const [formData, setFormData] = useState({
    title: post.title,
    body: post.body,
    caption: post.caption || "",
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase
      .from("posts")
      .update(formData)
      .eq("id", post.id);

    if (error) {
      alert(error.message);
    } else {
      onUpdate({ ...post, ...formData });
      onClose();
    }
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white w-full max-w-md rounded-xl shadow-2xl p-6 transform transition-all">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800">Edit Post</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            &times;
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Title
            </label>
            <input
              className="mt-1 block w-full rounded-md border-gray-300 border p-2 focus:ring-blue-500 focus:border-blue-500"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Content
            </label>
            <textarea
              className="mt-1 block w-full rounded-md border-gray-300 border p-2 h-32"
              value={formData.body}
              onChange={(e) =>
                setFormData({ ...formData, body: e.target.value })
              }
              required
            />
          </div>

          <div className="flex gap-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
            >
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
export default EditModal;
