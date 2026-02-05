import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "../../services/supabaseClient";
import { Post } from "../../types/blog.types";
import CommentSection from "../../components/CommentsForm";
import Spinner from "../../components/Spinner";

const PostDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      const { data, error } = await supabase
        .from("posts")
        .select(
          `
          *,
          profiles (*)
        `,
        )
        .eq("id", id)
        .single();

      if (error) console.error(error.message);
      else setPost(data);
      setLoading(false);
    };

    fetchPost();
  }, [id]);

  const handleCommentAdded = () => {
    // Optionally, you can refetch the post or comments here if needed
  };

  if (loading)
    return (
      <div className="max-w-4xl mx-auto p-6">
        <Spinner />
      </div>
    );
  if (!post)
    return (
      <div className="max-w-4xl mx-auto p-6 text-lg text-white">
        <button
          className="mb-4 text-white hover:text-blue-400 transition"
          onClick={() => window.history.back()}
        >
          ← Back
        </button>

        <h1 className="text-2xl font-bold">Post not found</h1>
      </div>
    );

  return (
    <div className="max-w-4xl mx-auto p-6">
      <button
        className="mb-4 text-white hover:text-blue-400 transition"
        onClick={() => window.history.back()}
      >
        ← Back to Blog
      </button>
      <div className="w-full max-w-4xl px-6 pt-6 pb-4 lg:px-8 bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg shadow-md">
        <h1 className="text-4xl font-bold mb-4 text-white">{post.title}</h1>
        <p className="mb-6 text-white">By {post.profiles?.full_name}</p>

        {post.image_url && (
          <img
            src={post.image_url}
            alt={post.title}
            className="w-full rounded-xl mb-6"
          />
        )}

        <div className="prose lg:prose-xl mb-12 text-white">
          <p>{post.body}</p>
        </div>

        {/* The Comment Section we built earlier */}
        <CommentSection postId={post.id} onCommentAdded={handleCommentAdded} />
      </div>
    </div>
  );
};
export default PostDetail;
