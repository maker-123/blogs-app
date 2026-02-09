import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faComment } from "@fortawesome/free-regular-svg-icons";
import { faEllipsis } from "@fortawesome/free-solid-svg-icons";
import CommentForm from "./CommentsForm";
import { Post, UserProfile } from "../types/blog.types";
import { formatDistanceToNow } from "date-fns/formatDistanceToNow";
import { supabase } from "../services/supabaseClient";
import { Link } from "react-router-dom";

interface PostCardProps {
  post: Post;
  activePostId: string | null;
  setActivePostId: (id: string | null) => void;
  onEdit: (post: Post) => void;
  onDelete: (post: Post) => void;
}

const PostCard = ({
  post,
  activePostId,
  setActivePostId,
  onEdit,
  onDelete,
}: PostCardProps) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setCurrentUser] = useState<UserProfile | null>(null);
  const [showMore, setShowMore] = useState(false);

  useEffect(() => {
    const fetchUserAndProfile = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        const { data: profile, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single();

        if (!error && profile) {
          setCurrentUser({ ...user, profile });
        }
      } else {
        setCurrentUser(null);
      }
    };

    fetchUserAndProfile();
  }, []);
  function formatDate(dateString: string) {
    const date = new Date(dateString);
    return formatDistanceToNow(date, { addSuffix: true });
  }
  const PostTitle = ({ title }: { title: string }) => {
    const limit = 50;
    const displayTitle =
      title.length > limit ? title.slice(0, limit) + "..." : title;

    return (
      <h2 className="text-lg font-semibold hover:text-blue-400 text-white transition cursor-pointer ">
        {displayTitle}
      </h2>
    );
  };
  const PostBody = ({ body }: { body: string }) => {
    const limit = 200;
    if (showMore) {
      return <p className="text-white">{body}</p>;
    }
    const displayBody =
      body.length > limit ? body.slice(0, limit) + "..." : body;

    return <p className="text-white">{displayBody}</p>;
  };

  return (
    <div className="w-full max-w-4xl px-6 pt-6 pb-4 lg:px-8 bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg shadow-md">
      <div className="flex justify-between items-center">
        <Link to={`/post/${post.id}`}>{PostTitle({ title: post.title })}</Link>

        <div className="relative">
          {user && user.id === post.user_id && (
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="p-2 hover:bg-gray-700 rounded-full transition"
            >
              <FontAwesomeIcon icon={faEllipsis} color="white" size="lg" />
            </button>
          )}

          {user && user.id === post.user_id && menuOpen && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => setMenuOpen(false)}
              />
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-20 border border-white/10 overflow-hidden">
                <button
                  onClick={() => {
                    onEdit(post);
                    setMenuOpen(false);
                  }}
                  className="flex w-full items-center px-4 py-2 text-sm hover:bg-gray-200 text-gray-700"
                >
                  Edit Post
                </button>
                <button
                  onClick={() => {
                    onDelete(post);
                    setMenuOpen(false);
                  }}
                  className="flex w-full items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                >
                  Delete Post
                </button>
              </div>
            </>
          )}
        </div>
      </div>
      <div className="flex items-center gap-2 py-3">
        <img
          src={post.profiles?.avatar_url || ""}
          alt={post.title}
          className="w-5  h-5 rounded-full object-cover"
        />
        <span className="text-sm font-normal text-white/50 ">
          Posted by {post.profiles?.full_name || "Unknown User"} •{" "}
          {formatDate(post.created_at)}
        </span>
      </div>
      {PostBody({ body: post.body })}
      {post.body.length > 200 && (
        <button
          onClick={() => setShowMore(!showMore)}
          className="text-sm text-blue-400 hover:underline mt-2"
        >
          {showMore ? "Show Less" : "Read More"}
        </button>
      )}
      {post.image_url && (
        <div className="border border-white/10 my-4 rounded-lg overflow-hidden">
          <img
            src={post.image_url}
            alt={post.title}
            className="object-cover w-full max-h-96"
          />
        </div>
      )}

      <div>
        <button
          onClick={() =>
            setActivePostId(activePostId === post.id ? null : post.id)
          }
          className="text-white px-2 py-1 rounded hover:bg-gray-700 transition w-full"
        >
          <FontAwesomeIcon icon={faComment} color="white" className="mr-2" />
          {activePostId === post.id ? "Close" : "Comments"}
        </button>

        {activePostId === post.id && (
          <div className="mt-4">
            <CommentForm
              postId={post.id}
              onCommentAdded={() => setActivePostId(null)}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default PostCard;
