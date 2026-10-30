import { Activity } from "lucide-react";
import React from "react";

const iconSet = [
  // Medical icons, calendar icons, etc.
  () => (
    // hospital 1st icon
    <svg
      width="32"
      height="32"
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="32" height="32" rx="16" fill="#3B82F6" />
      <path
        d="M11.5 9.25V10.7617H20.5V9.25H11.5ZM19.7617 11.5C20.1602 11.5 20.5 11.6523 20.7812 11.957C21.0859 12.2383 21.2383 12.5898 21.2383 13.0117V21.2383C21.2383 21.6602 21.0859 22.0234 20.7812 22.3281C20.5 22.6094 20.1602 22.75 19.7617 22.75H12.2383C11.8398 22.75 11.4883 22.6094 11.1836 22.3281C10.9023 22.0234 10.7617 21.6602 10.7617 21.2383V13.0117C10.7617 12.5898 10.9023 12.2383 11.1836 11.957C11.4883 11.6523 11.8398 11.5 12.2383 11.5H19.7617ZM18.9883 18.25V16H17.125V14.1367H14.875V16H13.0117V18.25H14.875V20.1133H17.125V18.25H18.9883Z"
        fill="white"
      />
    </svg>
  ),
  () => (
    // lab funnel icon
    <svg
      width="32"
      height="32"
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="32" height="32" rx="16" fill="#22C55E" />
      <path
        d="M21.8359 20.8164C21.9766 20.9805 22.0352 21.1562 22.0117 21.3438C21.9883 21.5078 21.9062 21.6602 21.7656 21.8008C21.625 21.9414 21.4492 22.0117 21.2383 22.0117H10.7617C10.5508 22.0117 10.375 21.9414 10.2344 21.8008C10.0938 21.6602 10.0117 21.5078 9.98828 21.3438C9.96484 21.1562 10.0234 20.9805 10.1641 20.8164L14.4883 15.0156V11.8867L13.5039 10.6211C13.3867 10.4805 13.3633 10.3398 13.4336 10.1992C13.5039 10.0586 13.6211 9.98828 13.7852 9.98828H18.2148C18.3789 9.98828 18.4961 10.0586 18.5664 10.1992C18.6367 10.3398 18.6133 10.4805 18.4961 10.6211L17.5117 11.8867V15.0156L21.8359 20.8164Z"
        fill="white"
      />
    </svg>
  ),
  () => (
    // drop + icon
    <svg
      width="32"
      height="32"
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="32" height="32" rx="16" fill="#EAB308" />
      <path
        d="M16 8.51172C20.0078 11.9102 22.0117 14.8516 22.0117 17.3359C22.0117 18.2734 21.8477 19.1289 21.5195 19.9023C21.1914 20.6523 20.7461 21.2969 20.1836 21.8359C19.6211 22.375 18.9766 22.7852 18.25 23.0664C17.5469 23.3477 16.7969 23.4883 16 23.4883C15.2031 23.4883 14.4414 23.3477 13.7148 23.0664C13.0117 22.7852 12.3789 22.375 11.8164 21.8359C11.2539 21.2969 10.8086 20.6523 10.4805 19.9023C10.1523 19.1289 9.98828 18.2734 9.98828 17.3359C9.98828 14.8516 11.9922 11.9102 16 8.51172ZM18.25 20.5V18.9883H13.75V20.5H18.25ZM18.25 16.7383V15.2617H16.7383V13.75H15.2617V15.2617H13.75V16.7383H15.2617V18.25H16.7383V16.7383H18.25Z"
        fill="white"
      />
    </svg>
  ),
  () => (
    // lab microscope icon
    <svg
      width="32"
      height="32"
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="32" height="32" rx="16" fill="#A855F7" />
      <path
        d="M12.2383 21.2383H14.4883V19.7617C13.8086 19.7617 13.1758 19.5977 12.5898 19.2695C12.0273 18.918 11.582 18.4609 11.2539 17.8984C10.9258 17.3125 10.7617 16.6797 10.7617 16C10.7617 15.2266 10.9727 14.5234 11.3945 13.8906C11.8398 13.2578 12.4023 12.8008 13.082 12.5195C13.0586 12.6133 13.0352 12.6953 13.0117 12.7656C13.0117 12.8359 13.0117 12.918 13.0117 13.0117C13.0117 13.4102 13.1172 13.7617 13.3281 14.0664C13.0234 14.2773 12.7656 14.5586 12.5547 14.9102C12.3438 15.2383 12.2383 15.6016 12.2383 16C12.2383 16.4219 12.3438 16.8086 12.5547 17.1602C12.7656 17.4883 13.0352 17.7578 13.3633 17.9688C13.7148 18.1562 14.0898 18.25 14.4883 18.25H20.5C20.5 18.6719 20.3477 19.0352 20.043 19.3398C19.7617 19.6211 19.4102 19.7617 18.9883 19.7617H16.7383V21.2383H19.7617C20.1602 21.2383 20.5 21.3906 20.7812 21.6953C21.0859 21.9766 21.2383 22.3281 21.2383 22.75H10.7617C10.7617 22.3281 10.9023 21.9766 11.1836 21.6953C11.4883 21.3906 11.8398 21.2383 12.2383 21.2383ZM14.9102 11.1484L14.4883 9.98828L15.1914 9.70703L14.9453 9.00391L16.3516 8.51172L16.5977 9.21484L17.3359 8.93359L19.375 14.5938L18.6719 14.8398L18.918 15.543L17.5117 16.0703L17.2656 15.3672L16.5625 15.6133L16.1055 14.418C16.3164 14.2305 16.4688 14.0195 16.5625 13.7852C16.6797 13.5508 16.7383 13.293 16.7383 13.0117C16.7383 12.4961 16.5625 12.0625 16.2109 11.7109C15.8594 11.3359 15.4258 11.1484 14.9102 11.1484ZM13.75 13.0117C13.75 13.3164 13.8555 13.5859 14.0664 13.8203C14.3008 14.0312 14.5703 14.1367 14.875 14.1367C15.1797 14.1367 15.4375 14.0312 15.6484 13.8203C15.8828 13.5859 16 13.3164 16 13.0117C16 12.6836 15.8828 12.4141 15.6484 12.2031C15.4375 11.9922 15.1797 11.8867 14.875 11.8867C14.5703 11.8867 14.3008 11.9922 14.0664 12.2031C13.8555 12.4141 13.75 12.6836 13.75 13.0117Z"
        fill="white"
      />
    </svg>
  ),
  () => (
    // stats icon
    <svg
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M11.2188 7.98438H13.9844V13.9844H11.2188V7.98438ZM5.59375 0.015625H8.40625V13.9844H5.59375V0.015625ZM0.015625 4.1875H3.01562V13.9844H0.015625V4.1875Z"
        fill="#2563EB"
      />
    </svg>
  ),
  () => (
    <svg
      width="30"
      height="36"
      viewBox="0 0 30 36"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M8.73047 26.7305H12.4805V24.2695C11.3477 24.2695 10.293 23.9961 9.31641 23.4492C8.37891 22.8633 7.63672 22.1016 7.08984 21.1641C6.54297 20.1875 6.26953 19.1328 6.26953 18C6.26953 16.7109 6.62109 15.5391 7.32422 14.4844C8.06641 13.4297 9.00391 12.668 10.1367 12.1992C10.0977 12.3555 10.0586 12.4922 10.0195 12.6094C10.0195 12.7266 10.0195 12.8633 10.0195 13.0195C10.0195 13.6836 10.1953 14.2695 10.5469 14.7773C10.0391 15.1289 9.60938 15.5977 9.25781 16.1836C8.90625 16.7305 8.73047 17.3359 8.73047 18C8.73047 18.7031 8.90625 19.3477 9.25781 19.9336C9.60938 20.4805 10.0586 20.9297 10.6055 21.2812C11.1914 21.5938 11.8164 21.75 12.4805 21.75H22.5C22.5 22.4531 22.2461 23.0586 21.7383 23.5664C21.2695 24.0352 20.6836 24.2695 19.9805 24.2695H16.2305V26.7305H21.2695C21.9336 26.7305 22.5 26.9844 22.9688 27.4922C23.4766 27.9609 23.7305 28.5469 23.7305 29.25H6.26953C6.26953 28.5469 6.50391 27.9609 6.97266 27.4922C7.48047 26.9844 8.06641 26.7305 8.73047 26.7305ZM13.1836 9.91406L12.4805 7.98047L13.6523 7.51172L13.2422 6.33984L15.5859 5.51953L15.9961 6.69141L17.2266 6.22266L20.625 15.6562L19.4531 16.0664L19.8633 17.2383L17.5195 18.1172L17.1094 16.9453L15.9375 17.3555L15.1758 15.3633C15.5273 15.0508 15.7812 14.6992 15.9375 14.3086C16.1328 13.918 16.2305 13.4883 16.2305 13.0195C16.2305 12.1602 15.9375 11.4375 15.3516 10.8516C14.7656 10.2266 14.043 9.91406 13.1836 9.91406ZM11.25 13.0195C11.25 13.5273 11.4258 13.9766 11.7773 14.3672C12.168 14.7188 12.6172 14.8945 13.125 14.8945C13.6328 14.8945 14.0625 14.7188 14.4141 14.3672C14.8047 13.9766 15 13.5273 15 13.0195C15 12.4727 14.8047 12.0234 14.4141 11.6719C14.0625 11.3203 13.6328 11.1445 13.125 11.1445C12.6172 11.1445 12.168 11.3203 11.7773 11.6719C11.4258 12.0234 11.25 12.4727 11.25 13.0195Z"
        fill="#2563EB"
      />
    </svg>
  ),

  // Add more SVG paths
];

const timelineData = [
  {
    date: new Date("2023-10-20T00:00:00Z"), // GMT date
    title: "Initial Diagnosis",
    content:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Ea molestias cupiditate suscipit quam aperiam? Porro tenetur modi nesciunt quibusdam necessitatibus!",
  },
  {
    date: new Date("2023-11-15T00:00:00Z"),
    title: "Treatment Plan",
    content:
      "Developed comprehensive treatment strategy including medication and therapy sessions for optimal patient recovery.",
  },
  {
    date: new Date("2023-12-10T00:00:00Z"),
    title: "First Follow-up",
    content:
      "Patient showed significant improvement in symptoms. Adjusted medication dosage based on progress.",
  },
  {
    date: new Date("2024-01-25T00:00:00Z"),
    title: "Lab Results Review",
    content:
      "Reviewed latest blood work and diagnostic tests. All parameters within normal range.",
  },
  {
    date: new Date("2024-03-15T00:00:00Z"),
    title: "Therapy Session",
    content:
      "Cognitive behavioral therapy session focused on stress management techniques and coping strategies.",
  },
  {
    date: new Date("2024-05-08T00:00:00Z"),
    title: "Progress Evaluation",
    content:
      "Six-month progress evaluation shows remarkable improvement. Considering reduction in therapy frequency.",
  },
  {
    date: new Date("2024-07-20T00:00:00Z"),
    title: "Medication Adjustment",
    content:
      "Reduced medication dosage as patient maintains stable condition with minimal symptoms.",
  },
  {
    date: new Date("2024-09-12T00:00:00Z"),
    title: "Annual Checkup",
    content:
      "Comprehensive annual health checkup completed. Patient reports excellent quality of life.",
  },
];

const formatDate = (gmtDate) => {
  return new Date(gmtDate).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });
};

const getRandomIcon = () => {
  const IconComponent = iconSet[Math.floor(Math.random() * iconSet.length)];
  return IconComponent();
};

const PatientTimeline = () => {
  return (
    <div>
      <div className="flex flex-row text-xl my-5 mx-4 items-center gap-3">
        <Activity className="text-blue-500" />
        Patient History Timeline
      </div>
      <div className="flex flex-col w-full items-center gap-3">
        {timelineData?.map((item, index) => (
          <div
            key={index}
            className="flex flex-row w-full gap-3 p-2 items-center"
          >
            <div className="w-8 h-8 md:w-10 md:h-10 lg:w-12 lg:h-12">
              {getRandomIcon()}
            </div>
            <div>
              <span>{formatDate(item?.date)} </span>
              <h2>{item?.title} </h2>
              <p>{item?.content?.slice(0, 300) + "..."}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PatientTimeline;
