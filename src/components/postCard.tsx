import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faComment } from "@fortawesome/free-regular-svg-icons";
import { faEllipsis } from "@fortawesome/free-solid-svg-icons";
import CommentForm from "./CommentsForm";
import { Post } from "../types/blog.types";
import { formatDistanceToNow } from "date-fns/formatDistanceToNow";

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

  function formatDate(dateString: string) {
    const date = new Date(dateString);
    return formatDistanceToNow(date, { addSuffix: true });
  }

  return (
    <div className="w-full max-w-4xl px-6 pt-6 pb-4 lg:px-8 bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg shadow-md">
      <div className="flex justify-between items-center">
        <h1 className="text-lg font-semibold text-white">
          {post.title}{" "}
          <span className="text-sm font-normal text-white/50 ml-2">
            {formatDate(post.created_at)}
          </span>
        </h1>

        <div className="relative">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="p-2 hover:bg-gray-700 rounded-full transition"
          >
            <FontAwesomeIcon icon={faEllipsis} color="white" size="lg" />
          </button>

          {menuOpen && (
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

      <p className="text-white mt-2">{post.body}</p>

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
