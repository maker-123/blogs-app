import { useEffect, useState } from "react";
import { supabase } from "../../services/supabaseClient";
import CommentForm from "../../components/CommentsForm";

const PostList = () => {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activePostId, setActivePostId] = useState<string | null>(null);
  useEffect(() => {
    const getPosts = async () => {
      setLoading(true);
      const { data } = await supabase.from("posts").select("*");
      if (data) setPosts(data);
      setLoading(false);
    };

    getPosts();
  }, []);
  const handleDelete = async (post: any) => {
    const confirmDelete = window.confirm(
      "Delete this post and its image permanently?",
    );
    if (!confirmDelete) return;

    try {
      if (post.image_url) {
        const filePath = post.image_url.split("/").pop();
        const { error: storageError } = await supabase.storage
          .from("blog-images")
          .remove([filePath]);

        if (storageError) console.error("Storage error:", storageError.message);
      }

      const { data, error: dbError } = await supabase
        .from("posts")
        .delete()
        .eq("id", post.id);

      if (dbError) throw dbError;
      console.log("Deleted post:", data);
      console.log("Post and image deleted!");
      setPosts(posts.filter((p) => p.id !== post.id));
    } catch (error: any) {
      alert(error.message);
    }
  };

  if (loading) return <div>Loading posts...</div>;

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Blog Posts</h1>
      <button
        className="bg-green-500 text-white px-2 py-1 rounded mb-4"
        onClick={() => (window.location.href = "/post/create")}
      >
        Create New Post
      </button>
      {posts.map((post) => (
        <div key={post.id} className="border-b py-2">
          <h2 className="text-lg font-semibold">{post.title}</h2>
          <p>{post.body}</p>
          <p>{post.caption}</p>
          <img
            src={post.image_url}
            alt={post.title}
            className="w-64 h-64 object-cover"
          />
          <button
            onClick={() =>
              setActivePostId(activePostId === post.id ? null : post.id)
            }
            className="bg-gray-500 text-white px-2 py-1 rounded mr-2"
          >
            {activePostId === post.id ? "Close" : "Comment"}
          </button>
          {activePostId === post.id && (
            <div className="mt-4 p-4 bg-gray-100 rounded">
              <CommentForm
                postId={post.id}
                onCommentAdded={() => {
                  setActivePostId(null);
                }}
              />
            </div>
          )}

          <button className="bg-blue-500 text-white px-2 py-1 rounded">
            Edit
          </button>
          <button
            className="bg-red-500 text-white px-2 py-1 rounded ml-2"
            onClick={() => handleDelete(post)}
          >
            Delete
          </button>
        </div>
      ))}
    </div>
  );
};

export default PostList;
