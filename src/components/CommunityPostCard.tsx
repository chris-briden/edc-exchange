import Link from "next/link";
import { Heart, MessageCircle, Share2 } from "lucide-react";
import type { CommunityPost } from "@/lib/data";
import type { Post } from "@/lib/types";

const typeStyles: Record<string, { badge: string; bg: string }> = {
  collection: { badge: "Collection", bg: "bg-purple-100 text-purple-700" },
  review: { badge: "Review", bg: "bg-blue-100 text-blue-700" },
  discussion: { badge: "Discussion", bg: "bg-green-100 text-green-700" },
  photo: { badge: "Photo", bg: "bg-amber-100 text-amber-700" },
};

function isDbPost(post: CommunityPost | Post): post is Post {
  return "user_id" in post;
}

export default function CommunityPostCard({
  post,
}: {
  post: CommunityPost | Post;
}) {
  if (isDbPost(post)) {
    const style = typeStyles[post.type] || typeStyles.discussion;
    const username = post.profiles?.username || "User";
    const userId = post.user_id;
    const likesCount = post.likes?.[0]?.count ?? 0;
    const commentsCount = post.comments?.[0]?.count ?? 0;

    return (
      <Link
        href="/community"
        className="bg-white rounded-2xl border border-gray-200 p-5 hover:shadow-md transition block"
      >
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-400 to-blue-500 flex items-center justify-center text-white font-bold text-sm">
            {username.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <span className="font-semibold text-sm">{username}</span>
            <p className="text-xs text-gray-400">
              {new Date(post.created_at).toLocaleDateString()}
            </p>
          </div>
          <span
            className={`px-2.5 py-1 rounded-full text-xs font-semibold ${style.bg}`}
          >
            {style.badge}
          </span>
        </div>
        <h3 className="font-bold text-lg leading-snug mb-2">{post.title}</h3>
        <p className="text-gray-600 text-sm leading-relaxed line-clamp-2">
          {post.content}
        </p>
        {post.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-3">
            {post.tags.map((tag) => (
              <span key={tag} className="text-xs text-orange-600 font-medium">
                #{tag}
              </span>
            ))}
          </div>
        )}
        <div className="flex items-center gap-6 mt-4 pt-4 border-t border-gray-100 text-gray-500 text-sm">
          <span className="flex items-center gap-1.5">
            <Heart className="w-4 h-4" />
            {likesCount}
          </span>
          <span className="flex items-center gap-1.5">
            <MessageCircle className="w-4 h-4" />
            {commentsCount}
          </span>
        </div>
      </Link>
    );
  }

  // Mock CommunityPost rendering
  const style = typeStyles[post.type] || typeStyles.discussion;

  return (
    <article className="bg-white rounded-2xl border border-gray-200 p-5 hover:shadow-md transition">
      <div className="flex items-center gap-3 mb-3">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-400 to-blue-500 flex items-center justify-center text-white font-bold text-sm">
          {post.author.username.charAt(0)}
        </div>
        <div className="flex-1 min-w-0">
          <Link
            href={`/profile/${post.author.id}`}
            className="font-semibold text-sm hover:text-orange-600 transition"
          >
            {post.author.username}
          </Link>
          <p className="text-xs text-gray-400">{post.createdAt}</p>
        </div>
        <span
          className={`px-2.5 py-1 rounded-full text-xs font-semibold ${style.bg}`}
        >
          {style.badge}
        </span>
      </div>
      <h3 className="font-bold text-lg leading-snug mb-2">{post.title}</h3>
      <p className="text-gray-600 text-sm leading-relaxed">{post.content}</p>
      {post.items.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-3">
          {post.items.map((item) => (
            <span
              key={item}
              className="px-2.5 py-1 rounded-lg bg-gray-100 text-gray-600 text-xs font-medium"
            >
              {item}
            </span>
          ))}
        </div>
      )}
      <div className="flex flex-wrap gap-1.5 mt-3">
        {post.tags.map((tag) => (
          <span key={tag} className="text-xs text-orange-600 font-medium">
            #{tag}
          </span>
        ))}
      </div>
      <div className="flex items-center gap-6 mt-4 pt-4 border-t border-gray-100 text-gray-500 text-sm">
        <button className="flex items-center gap-1.5 hover:text-red-500 transition">
          <Heart className="w-4 h-4" />
          <span>{post.likes}</span>
        </button>
        <button className="flex items-center gap-1.5 hover:text-blue-500 transition">
          <MessageCircle className="w-4 h-4" />
          <span>{post.comments}</span>
        </button>
        <button className="flex items-center gap-1.5 hover:text-green-500 transition ml-auto">
          <Share2 className="w-4 h-4" />
          <span>Share</span>
        </button>
      </div>
    </article>
  );
}
