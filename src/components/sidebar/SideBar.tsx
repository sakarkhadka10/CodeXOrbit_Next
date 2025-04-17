import React from "react";
import Socials from "./components/Socials";
import PopularPost from "./components/PopularPost";
import NewsLetter from "./components/NewsLetter";
import MainTags from "./components/MainTags";

const SideBar = () => {
  return (
    <div className=" space-y-8 text-white">
      <Socials />
      <PopularPost />
      <NewsLetter />
      <MainTags />
    </div>
  );
};

export default SideBar;
