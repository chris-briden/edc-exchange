"use client";

import { useState, useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { Send, Loader2, ArrowLeft, MessageSquare } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { createClient } from "@/lib/supabase-browser";
import type { Profile } from "@/lib/types";

type Message = {
  id: string;
  sender_id: string;
  receiver_id: string;
  item_id: string | null;
  content: string;
  is_read: boolean;
  created_at: string;
  sender?: Profile;
  receiver?: Profile;
};

type Conversation = {
  userId: string;
  profile: Profile;
  lastMessage: string;
  lastAt: string;
  unread: number;
};

function MessagesContent() {
  const searchParams = useSearchParams();
  const toParam = searchParams.get("to");
  const itemParam = searchParams.get("item");

  const [loading, setLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConvo, setActiveConvo] = useState<string | null>(toParam);
  const [activeProfile, setActiveProfile] = useState<Profile | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState(
    itemParam ? "Hi! I'm interested in your listing." : ""
  );
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const supabase = createClient();

    const loadAll = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        window.location.href = "/login?redirect=/messages";
        return;
      }
      setCurrentUserId(user.id);

      // Fetch all messages involving this user
      const { data: allMessages } = await supabase
        .from("messages")
        .select("*, sender:profiles!messages_sender_id_fkey(*), receiver:profiles!messages_receiver_id_fkey(*)")
        .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)
        .order("created_at", { ascending: false });

      if (allMessages) {
        // Group into conversations
        const convoMap = new Map<string, Conversation>();
        for (const msg of allMessages as Message[]) {
          const otherId =
            msg.sender_id === user.id ? msg.receiver_id : msg.sender_id;
          const otherProfile =
            msg.sender_id === user.id ? msg.receiver : msg.sender;

          if (!convoMap.has(otherId) && otherProfile) {
            convoMap.set(otherId, {
              userId: otherId,
              profile: otherProfile,
              lastMessage: msg.content,
              lastAt: msg.created_at,
              unread:
                msg.receiver_id === user.id && !msg.is_read ? 1 : 0,
            });
          } else if (convoMap.has(otherId)) {
            const existing = convoMap.get(otherId)!;
            if (msg.receiver_id === user.id && !msg.is_read) {
              existing.unread += 1;
            }
          }
        }
        setConversations(Array.from(convoMap.values()));
      }

      // If opening with ?to= param, load that profile
      if (toParam) {
        const { data: toProfile } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", toParam)
          .single();
        if (toProfile) setActiveProfile(toProfile as Profile);
      }

      setLoading(false);
    };

    loadAll();
  }, [toParam, itemParam]);

  // Load messages for active conversation
  useEffect(() => {
    if (!activeConvo || !currentUserId) return;

    const supabase = createClient();

    const loadMessages = async () => {
      const { data } = await supabase
        .from("messages")
        .select("*")
        .or(
          `and(sender_id.eq.${currentUserId},receiver_id.eq.${activeConvo}),and(sender_id.eq.${activeConvo},receiver_id.eq.${currentUserId})`
        )
        .order("created_at", { ascending: true });

      if (data) setMessages(data as Message[]);

      // Mark as read
      await supabase
        .from("messages")
        .update({ is_read: true })
        .eq("sender_id", activeConvo)
        .eq("receiver_id", currentUserId)
        .eq("is_read", false);
    };

    loadMessages();

    // Also load profile if not set
    if (!activeProfile) {
      supabase
        .from("profiles")
        .select("*")
        .eq("id", activeConvo)
        .single()
        .then(({ data }) => {
          if (data) setActiveProfile(data as Profile);
        });
    }
  }, [activeConvo, currentUserId, activeProfile]);

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!newMessage.trim() || !activeConvo || !currentUserId || sending) return;
    setSending(true);

    const supabase = createClient();
    const { data, error } = await supabase
      .from("messages")
      .insert({
        sender_id: currentUserId,
        receiver_id: activeConvo,
        item_id: itemParam || null,
        content: newMessage.trim(),
      })
      .select()
      .single();

    if (!error && data) {
      setMessages((prev) => [...prev, data as Message]);
      setNewMessage("");

      // Update conversation list
      const existing = conversations.find((c) => c.userId === activeConvo);
      if (existing) {
        existing.lastMessage = data.content;
        existing.lastAt = data.created_at;
        setConversations([...conversations]);
      } else if (activeProfile) {
        setConversations((prev) => [
          {
            userId: activeConvo,
            profile: activeProfile,
            lastMessage: data.content,
            lastAt: data.created_at,
            unread: 0,
          },
          ...prev,
        ]);
      }
    }
    setSending(false);
  };

  const selectConvo = (userId: string, profile: Profile) => {
    setActiveConvo(userId);
    setActiveProfile(profile);
    setMessages([]);
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="w-8 h-8 animate-spin text-orange-600" />
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-black text-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6">
          <h1 className="text-2xl font-extrabold mb-6">Messages</h1>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 min-h-[60vh]">
            {/* Conversations list */}
            <div className="md:col-span-1 border border-zinc-800 rounded-2xl overflow-hidden bg-zinc-900/50">
              <div className="p-3 border-b border-zinc-800 font-semibold text-sm text-gray-400">
                Conversations
              </div>
              <div className="divide-y divide-zinc-800 max-h-[60vh] overflow-y-auto">
                {conversations.length === 0 && !toParam && (
                  <div className="p-6 text-center text-gray-400 text-sm">
                    <MessageSquare className="w-8 h-8 mx-auto mb-2" />
                    No conversations yet
                  </div>
                )}
                {conversations.map((convo) => (
                  <button
                    key={convo.userId}
                    onClick={() => selectConvo(convo.userId, convo.profile)}
                    className={`w-full text-left p-3 transition flex items-center gap-3 ${
                      activeConvo === convo.userId ? "bg-zinc-800" : "hover:bg-zinc-800"
                    }`}
                  >
                  {convo.profile.avatar_url ? (
                    <Image
                      src={convo.profile.avatar_url}
                      alt={convo.profile.username || ""}
                      width={40}
                      height={40}
                      className="rounded-full w-10 h-10 object-cover shrink-0"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-400 to-amber-600 flex items-center justify-center text-white text-sm font-bold shrink-0">
                      {convo.profile.username?.charAt(0)?.toUpperCase() || "U"}
                    </div>
                  )}
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm truncate text-gray-200">
                        {convo.profile.username}
                      </p>
                      <p className="text-xs text-gray-500 truncate">
                        {convo.lastMessage}
                      </p>
                    </div>
                    {convo.unread > 0 && (
                      <span className="w-5 h-5 bg-orange-600 rounded-full text-white text-xs flex items-center justify-center">
                        {convo.unread}
                      </span>
                    )}
                  </button>
                ))}
                {/* Show toParam user even if no messages yet */}
                {toParam &&
                  activeProfile &&
                  !conversations.find((c) => c.userId === toParam) && (
                    <button
                      onClick={() => selectConvo(toParam, activeProfile)}
                      className={`w-full text-left p-3 transition flex items-center gap-3 ${
                        activeConvo === toParam ? "bg-zinc-800" : "hover:bg-zinc-800"
                      }`}
                    >
                    {activeProfile.avatar_url ? (
                      <Image
                        src={activeProfile.avatar_url}
                        alt={activeProfile.username || ""}
                        width={40}
                        height={40}
                        className="rounded-full w-10 h-10 object-cover shrink-0"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-400 to-amber-600 flex items-center justify-center text-white text-sm font-bold shrink-0">
                        {activeProfile.username?.charAt(0)?.toUpperCase() ||
                          "U"}
                      </div>
                    )}
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-sm text-gray-200">
                          {activeProfile.username}
                        </p>
                        <p className="text-xs text-gray-500">New conversation</p>
                      </div>
                    </button>
                  )}
              </div>
            </div>

            {/* Message thread */}
            <div className="md:col-span-2 border border-zinc-800 rounded-2xl overflow-hidden bg-zinc-900/50 flex flex-col">
              {activeConvo && activeProfile ? (
                <>
                  {/* Thread header */}
                  <div className="p-4 border-b border-zinc-800 flex items-center gap-3">
                  <button
                    className="md:hidden"
                    onClick={() => setActiveConvo(null)}
                  >
                    <ArrowLeft className="w-5 h-5" />
                  </button>
                  <Link
                    href={`/profile/${activeConvo}`}
                    className="flex items-center gap-2 hover:opacity-80 transition"
                  >
                    {activeProfile.avatar_url ? (
                      <Image
                        src={activeProfile.avatar_url}
                        alt={activeProfile.username || ""}
                        width={32}
                        height={32}
                        className="rounded-full w-8 h-8 object-cover"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-400 to-amber-600 flex items-center justify-center text-white text-xs font-bold">
                        {activeProfile.username?.charAt(0)?.toUpperCase() ||
                          "U"}
                      </div>
                    )}
                    <span className="font-semibold text-sm text-gray-200">
                      {activeProfile.username}
                    </span>
                  </Link>
                  </div>

                  {/* Messages */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-3 min-h-[300px] max-h-[50vh]">
                    {messages.length === 0 && (
                      <p className="text-center text-gray-400 text-sm py-8">
                        Start the conversation!
                      </p>
                    )}
                    {messages.map((msg) => {
                      const isMine = msg.sender_id === currentUserId;
                      return (
                        <div
                          key={msg.id}
                          className={`flex ${isMine ? "justify-end" : "justify-start"}`}
                        >
                          <div
                            className={`max-w-[75%] px-4 py-2.5 rounded-2xl text-sm ${
                              isMine
                                ? "bg-orange-600 text-white rounded-br-md"
                                : "bg-zinc-800 text-gray-300 rounded-bl-md"
                            }`}
                          >
                            <p>{msg.content}</p>
                            <p
                              className={`text-[10px] mt-1 ${
                                isMine ? "text-orange-200" : "text-gray-500"
                              }`}
                            >
                              {new Date(msg.created_at).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                    <div ref={messagesEndRef} />
                  </div>

                  {/* Input */}
                  <div className="p-3 border-t border-zinc-800">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyDown={(e) =>
                          e.key === "Enter" && !e.shiftKey && handleSend()
                        }
                        placeholder="Type a message..."
                        className="flex-1 px-4 py-2.5 rounded-xl bg-zinc-900/50 border border-zinc-700 text-white placeholder:text-gray-500 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      />
                    <button
                      onClick={handleSend}
                      disabled={sending || !newMessage.trim()}
                      className="px-4 py-2.5 rounded-xl bg-orange-700 text-white font-semibold hover:bg-orange-600 shadow-lg shadow-orange-900/50 transition disabled:opacity-50"
                    >
                      {sending ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Send className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center text-gray-400">
                  <div className="text-center">
                    <MessageSquare className="w-12 h-12 mx-auto mb-3" />
                    <p className="font-medium">Select a conversation</p>
                    <p className="text-sm mt-1">
                      Or start one from a seller's profile
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}

export default function MessagesPage() {
  return (
    <Suspense>
      <MessagesContent />
    </Suspense>
  );
}
