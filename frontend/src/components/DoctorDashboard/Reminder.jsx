import { Banner, BannerCollapseButton, Button } from "flowbite-react";
import { Bell, X } from "lucide-react";
// import { HiX } from "react-icons/hi";
// import { MdAnnouncement } from "react-icons/md";

export function ReminderComponent() {
  return (
    <Banner>
      <div
        className={`flex w-full lg:mt-5 justify-between bg-white border rounded-2xl border-gray-200  p-3`}
      >
        <div className="flex flex-row gap-4 items-center">
          <Bell />
          <div className="flex flex-col gap-3">
            <h1>
              Lorem ipsum dolor sit amet, consectetur adipisicing elit. Cumque,
              eius.
            </h1>
            <div className="flex gap-3">
              <Button className="cursor-pointer">Confirm</Button>
              <Button
                color={"alternative"}
                className="border border-black bg-gray-100 cursor-pointer"
              >
                Confirm
              </Button>
            </div>
          </div>
        </div>
        <BannerCollapseButton
          color="gray"
          className="border-0 bg-transparent text-gray-500 justify-end cursor-pointer hover:bg-white"
        >
          <X />
        </BannerCollapseButton>
      </div>
    </Banner>
  );
}
