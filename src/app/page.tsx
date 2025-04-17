import Hero from "@/components/home/Hero";
import Posts from "@/components/home/Posts";
import SideBar from "@/components/sidebar/SideBar";

export default function Home() {
  return (
    <div className="min-h-screen  bg-[#f8fafc]">
      <Hero />
      <div className="grid grid-cols-1 lg:grid-cols-12 place-items-start gap-4 pb-16 px-1 sm:px-4 md:px-6 lg:px-14">
        <section className="col-span-1 lg:col-span-9 w-full">
          <Posts />
        </section>
        <section className="col-span-1 lg:col-span-3 w-full pt-8">
          <SideBar />
        </section>
      </div>
    </div>
  );
}
