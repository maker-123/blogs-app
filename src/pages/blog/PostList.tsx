import { useEffect, useState } from "react";
import { supabase } from "../../services/supabaseClient";
import { Post } from "../../types/blog.types";
import PostCreate from "./PostCreate";
import PostCard from "../../components/postCard";
import PostUpdate from "../../components/Editmodal";

const PostList = () => {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activePostId, setActivePostId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  const ITEMS_PER_PAGE = 1;

  const openEditModal = (post: Post) => {
    setSelectedPost(post);
    setIsModalOpen(true);
  };

  const getPosts = async (pageNumber: number) => {
    setLoading(true);

    const from = pageNumber * ITEMS_PER_PAGE;
    const to = from + ITEMS_PER_PAGE - 1;

    const { data, error } = await supabase
      .from("posts")
      .select("*")
      .order("created_at", { ascending: false })
      .range(from, to);

    if (error) {
      console.error("Error fetching posts:", error.message);
    } else if (data) {
      if (pageNumber === 0) {
        setPosts(data);
      } else {
        setPosts((prev) => {
          const existingIds = new Set(prev.map((p) => p.id));
          const newPosts = data.filter((p) => !existingIds.has(p.id));
          return [...prev, ...newPosts];
        });
      }

      if (data.length < ITEMS_PER_PAGE) {
        setHasMore(false);
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    getPosts(page);
  }, [page]);

  const handleRefresh = () => {
    if (page === 0) {
      getPosts(0);
    } else {
      setPage(0);
    }
  };

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

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error("Error logging out:", error.message);
    } else {
      window.location.href = "/";
    }
  };

  if (loading) return <div>Loading posts...</div>;

  return (
    <div className="flex min-h-screen items-center justify-center  px-4 sm:px-6 lg:px-8 ">
      <button
        onClick={handleLogout}
        className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition font-semibold absolute top-4 right-4"
      >
        Log Out
      </button>
      <div className="w-full max-w-4xl px-6 py-12 lg:px-8 ">
        <h1 className="text-2xl font-bold mb-4 text-white">Blog Posts</h1>

        <div className="p-3 bg-white/5 backdrop-blur-sm rounded-lg border border-white/10 mb-3">
          <button
            onClick={() => setIsCreateOpen(true)}
            className="w-full text-white hover:text-gray-300 border border-white/10 bg-white/5 backdrop-blur-sm rounded-lg px-4 py-2 text-left"
          >
            Whats on your mind, Alvin?
          </button>
        </div>
        <div className="flex flex-col gap-y-4">
          {posts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              activePostId={activePostId}
              setActivePostId={setActivePostId}
              onEdit={openEditModal}
              onDelete={handleDelete}
            />
          ))}

          {hasMore && (
            <button
              onClick={() => {
                setPage((prev) => prev + 1);
              }}
              disabled={loading}
              className="mt-4 bg-gray-800 text-white py-2 rounded-lg hover:bg-gray-700 transition"
            >
              {loading ? "Loading..." : "Load More Posts"}
            </button>
          )}
          {isModalOpen && selectedPost && (
            <PostUpdate
              post={selectedPost}
              isOpen={isModalOpen}
              onClose={() => setIsModalOpen(false)}
              onPostUpdated={() => {
                getPosts(0);
                setIsModalOpen(false);
              }}
            />
          )}
        </div>
        <PostCreate
          isOpen={isCreateOpen}
          onClose={() => setIsCreateOpen(false)}
          onPostCreated={handleRefresh}
        />
      </div>
    </div>
  );
};

export default PostList;
