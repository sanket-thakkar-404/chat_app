import { Search } from "lucide-react";
import { useUserStore } from "../Store/useUserStore";
import { useEffect, useState } from "react";

const SearchUser = () => {
  const {  getMyFriends } = useUserStore();
  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    getMyFriends();
  }, [getMyFriends]);

  // const filteredFriends =
  //   friends.filter((friend) => {
  //     const first = friend.fullname?.firstName || "";
  //     const last = friend.fullname?.lastName || "";
  //     const fullName = `${first} ${last}`.toLowerCase();

  //     return fullName.includes(searchText.toLocaleLowerCase());
  //   }) || [];

  return (
    <div className="flex relative gap-2 items-center border border-gray-400 p-2 rounded-xl mb-3">
      <Search className="size-4" />
      <input
        type="text"
        value={searchText}
        placeholder="Search Your Friend"
        className="w-full outline-none"
        onChange={(e) => setSearchText(e.target.value)}
      />
    </div>
  );
};

export default SearchUser;
