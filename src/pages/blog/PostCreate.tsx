import { useState } from "react";
import { supabase } from "../../services/supabaseClient";
import { useNavigate } from "react-router-dom";

const PostCreate = () => {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [caption, setCaption] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);

    const { data, error } = await supabase
      .from("posts")
      .insert([{ title, body, caption }]) // user_id is set automatically by Postgres default
      .select();
    console.log(data);
    navigate("/post");
    setLoading(false);

    if (error) {
      alert(error.message);
    } else {
      alert("Blog post created successfully!");
      setTitle("");
      setBody("");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />
      <textarea
        placeholder="Write your content..."
        value={body}
        onChange={(e) => setBody(e.target.value)}
        required
      />
      <textarea
        placeholder="Caption"
        value={caption}
        onChange={(e) => setCaption(e.target.value)}
      ></textarea>
      <button type="submit" disabled={loading}>
        {loading ? "Posting..." : "Create Blog Post"}
      </button>
    </form>
  );
};
export default PostCreate;
