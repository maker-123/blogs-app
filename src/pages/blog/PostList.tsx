import { useEffect, useState } from "react";
import { supabase } from "../../services/supabaseClient";

const PostList = () => {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getPosts = async () => {
      setLoading(true);
      const { data } = await supabase.from("posts").select("*");
      if (data) setPosts(data);
      setLoading(false);
    };

    getPosts();
  }, []);

  if (loading) return <div>Loading posts...</div>;

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Blog Posts</h1>
      {posts.map((post) => (
        <div key={post.id} className="border-b py-2">
          <h2 className="text-lg font-semibold">{post.title}</h2>
          <p>{post.body}</p>
          <p>{post.caption}</p>
        </div>
      ))}
    </div>
  );
};

export default PostList;
