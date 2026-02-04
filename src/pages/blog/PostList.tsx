import { useEffect, useState } from "react";
import { supabase } from "../../services/supabaseClient";
import CommentForm from "../../components/CommentsForm";
import EditModal from "../../components/Editmodal";
import { Post } from "../../types/blog.typs";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faComment } from "@fortawesome/free-regular-svg-icons";
import { faEllipsis } from "@fortawesome/free-solid-svg-icons";

const PostList = () => {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activePostId, setActivePostId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);

  const openEditModal = (post: Post) => {
    setSelectedPost(post);
    setIsModalOpen(true);
  };

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
    <div className="flex min-h-screen items-center justify-center py-12 px-4 sm:px-6 lg:px-8 ">
      <div className="w-full max-w-4xl px-6 py-12 lg:px-8 ">
        <h1 className="text-2xl font-bold mb-4 text-white">Blog Posts</h1>
        <button
          className="bg-green-500 text-white px-2 py-1 rounded mb-4"
          onClick={() => (window.location.href = "/post/create")}
        >
          Create New Post
        </button>
        <div className="flex flex-col gap-y-4">
          {posts.map((post) => (
            <div
              key={post.id}
              className="w-full max-w-4xl px-6 py-12 lg:px-8 bg-white rounded-lg shadow-md bg-white/5 backdrop-blur-sm border border-white/10"
            >
              <div className="flex justify-between items-center">
                <h1 className="text-lg font-semibold text-white">
                  {post.title}
                </h1>
                <button className="p-2 hover:bg-gray-700  rounded-full transition">
                  <FontAwesomeIcon icon={faEllipsis} color="white" size="lg" />
                </button>
              </div>
              {/*<p className="text-white">{post.body}</p>*/}
              {/*<p>{post.caption}</p>*/}
              <div className="border border-white/10 my-4 rounded-lg overflow-hidden">
                <img
                  src={post.image_url}
                  alt={post.title}
                  className="object-cover w-full "
                />
              </div>
              <div>
                <button
                  onClick={() =>
                    setActivePostId(activePostId === post.id ? null : post.id)
                  }
                  className=" text-white px-2 py-1 rounded hover:bg-gray-700 transition  w-full"
                >
                  <FontAwesomeIcon
                    icon={faComment}
                    color="white"
                    className="mr-2"
                  />
                  {activePostId === post.id ? "Close" : "Comment"}
                </button>
                {activePostId === post.id && (
                  <div className="">
                    <CommentForm
                      postId={post.id}
                      onCommentAdded={() => {
                        setActivePostId(null);
                      }}
                    />
                  </div>
                )}
              </div>

              <button
                onClick={() => openEditModal(post)}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition"
              >
                Edit Post
              </button>

              <button
                className="bg-red-500 text-white px-2 py-1 rounded ml-2"
                onClick={() => handleDelete(post)}
              >
                Delete
              </button>
            </div>
          ))}
          {isModalOpen && selectedPost && (
            <EditModal
              post={selectedPost}
              onClose={() => setIsModalOpen(false)}
              onUpdate={(updatedPost) => {
                setPosts(
                  posts.map((p) => (p.id === updatedPost.id ? updatedPost : p)),
                );
                setIsModalOpen(false);
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default PostList;
