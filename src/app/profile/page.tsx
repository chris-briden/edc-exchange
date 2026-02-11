import {
  MapPin,
  Calendar,
  Settings,
  Share2,
  Heart,
  MessageCircle,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ItemCard from "@/components/ItemCard";
import { users, edcItems } from "@/lib/data";

export default function ProfilePage() {
  const user = users[2]; // TitaniumTom as demo profile
  const userItems = edcItems.filter((i) => i.owner.id === user.id);

  return (
    <>
      <Navbar />

      {/* Profile header */}
      <div className="bg-gradient-to-br from-gray-900 to-gray-800 text-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
          <div className="flex flex-col sm:flex-row items-start gap-6">
            {/* Avatar */}
            <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center text-3xl font-bold shadow-lg">
              {user.username.charAt(0)}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3 flex-wrap">
                <h1 className="text-2xl font-extrabold">{user.username}</h1>
                {user.badges.map((badge) => (
                  <span
                    key={badge}
                    className="px-2.5 py-0.5 rounded-full bg-white/15 text-white/80 text-xs font-medium"
                  >
                    {badge}
                  </span>
                ))}
              </div>
              <p className="text-gray-300 mt-2 max-w-md">{user.bio}</p>
              <div className="flex items-center gap-5 mt-4 text-sm text-gray-400">
                <span className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  Joined {user.joinDate}
                </span>
                <span>{user.itemCount} items</span>
                <span>
                  <strong className="text-white">
                    {user.followers.toLocaleString()}
                  </strong>{" "}
                  followers
                </span>
                <span>
                  <strong className="text-white">{user.following}</strong>{" "}
                  following
                </span>
              </div>
            </div>
            <div className="flex gap-2">
              <button className="px-5 py-2 rounded-full bg-orange-600 text-white text-sm font-semibold hover:bg-orange-700 transition">
                Follow
              </button>
              <button className="p-2 rounded-full bg-white/10 text-white hover:bg-white/20 transition">
                <Share2 className="w-4 h-4" />
              </button>
              <button className="p-2 rounded-full bg-white/10 text-white hover:bg-white/20 transition">
                <Settings className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Collection / Listings */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        {/* Tabs */}
        <div className="flex gap-1 border-b border-gray-200 mb-6">
          {["Collection", "For Sale / Trade", "Reviews", "Activity"].map(
            (tab, i) => (
              <button
                key={tab}
                className={`px-4 py-3 text-sm font-medium border-b-2 transition ${
                  i === 0
                    ? "border-orange-600 text-orange-600"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                {tab}
              </button>
            )
          )}
        </div>

        {/* Daily carry spotlight */}
        <div className="bg-gradient-to-r from-orange-50 to-amber-50 rounded-2xl p-6 mb-8 border border-orange-100">
          <h3 className="font-bold text-lg mb-1">
            Today&apos;s Carry — Titanium Tuesday
          </h3>
          <p className="text-gray-600 text-sm mb-4">
            CRK Sebenza 31, Emisar D4V2 Ti, Tactile Turn Short, Ridge Wallet Ti
          </p>
          <div className="flex gap-3 flex-wrap">
            {["CRK Sebenza 31", "Emisar D4V2 Ti", "Tactile Turn Short", "Ridge Wallet Ti"].map(
              (item) => (
                <div
                  key={item}
                  className="w-20 h-20 rounded-xl bg-white border border-orange-200 flex items-center justify-center text-xs text-gray-500 font-medium text-center p-2"
                >
                  {item}
                </div>
              )
            )}
          </div>
        </div>

        {/* Items grid */}
        <h3 className="font-bold text-lg mb-4">
          Collection ({userItems.length} items)
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {userItems.map((item) => (
            <ItemCard key={item.id} item={item} />
          ))}
        </div>

        {userItems.length === 0 && (
          <div className="text-center py-12 text-gray-400">
            <p className="text-lg font-medium">No items yet</p>
            <p className="text-sm mt-1">
              Start building your collection!
            </p>
          </div>
        )}
      </div>

      <Footer />
    </>
  );
}
