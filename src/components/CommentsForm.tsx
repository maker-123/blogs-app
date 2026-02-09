import { useState, useEffect } from "react";
import { supabase } from "../services/supabaseClient";
import { Comment } from "../types/blog.types";

interface Props {
  postId: string;
  onCommentAdded: () => void;
}

const CommentForm = ({ postId, onCommentAdded }: Props) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchComments = async () => {
    const { data, error } = await supabase
      .from("comments")
      .select(
        `
        *,
        profiles (*)
      `,
      )
      .eq("post_id", postId)
      .order("created_at", { ascending: true })
      .returns<Comment[]>();

    if (!error && data) setComments(data);
  };

  useEffect(() => {
    fetchComments();
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    setLoading(true);

    const { error } = await supabase
      .from("comments")
      .insert([{ content: newComment, post_id: postId }]);

    if (error) {
      alert(error.message);
    } else {
      setNewComment("");
      fetchComments();
    }
    setLoading(false);
  };

  return (
    <div className="comment-section text-white">
      <h3 className="mb-2">Comments</h3>

      <div className="space-y-4">
        {comments.map((c) => (
          <div key={c.id} className="border-b pb-2">
            <p className="text-sm font-bold">
              {c.profiles?.full_name || "Anonymous"}
            </p>
            <div className="flex items-center gap-2 py-1">
              <img
                src={c.profiles?.avatar_url || ""}
                alt={c.content}
                className="w-5  h-5 rounded-full object-cover"
              />
              <span className="text-sm font-normal text-white/50 ">
                Posted by {c.profiles?.full_name || "Unknown User"}
              </span>
            </div>
            <p className="mb-2">{c.content}</p>
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="mt-4">
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Write a comment..."
          className="w-full p-2 border rounded text-black"
          required
        />
        <button
          type="submit"
          disabled={loading}
          className="mt-2 bg-blue-500 text-white p-2 rounded"
        >
          {loading ? "Posting..." : "Post Comment"}
        </button>
      </form>
    </div>
  );
};

export default CommentForm;
