import { getEmployerProfileAction } from "@/features/applicants/actions/applicant.action";
import Image from "next/image";
import React from "react";

type PageParams = {
  params: {
    employerId: string;
  };
};

const Page = async ({ params }: PageParams) => {
  const { employerId } = params;
  const res = await getEmployerProfileAction(employerId);

  if (res.status === "ERROR") {
    return (
      <div className="flex items-center justify-center py-20">
        <h1 className="text-xl font-bold text-red-500">{res.message}</h1>
      </div>
    );
  }

  const { users, employers } = res.data;

  return (
    <div className="w-full pb-20 bg-gray-50">
      {/* ---------------------- Banner + Avatar ---------------------- */}
      <div className="relative w-full h-72 md:h-80 bg-gray-200 overflow-hidden rounded-b-3xl shadow-lg">
        {employers?.bannerImageUrl && (
          <Image
            src={employers.bannerImageUrl}
            alt="Banner"
            fill
            className="object-cover"
          />
        )}

        {/* Avatar */}
        <div className="absolute left-22 md:left-6 -bottom-1 z-10">
          <div className="w-28 h-28 md:w-32 md:h-32 rounded-full overflow-hidden border-4 border-white shadow-xl bg-white">
            <Image
              src={users.avatarUrl ?? "/default-avatar.png"}
              alt={users.name}
              width={128}
              height={128}
              className="object-cover w-full h-full"
            />
          </div>
        </div>
      </div>

      {/* ---------------------- User Info ---------------------- */}
      <div className="mt-20 md:mt-24 px-6 md:px-12">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800">{users.name}</h1>
        <p className="text-gray-500 text-sm md:text-base mb-4">@{users.userName}</p>

        <div className="flex flex-wrap gap-6 text-gray-700">
          <p className="text-sm md:text-base">
            <span className="font-semibold">Email:</span> {users.email}
          </p>
          {users.phoneNumber && (
            <p className="text-sm md:text-base">
              <span className="font-semibold">Phone:</span> {users.phoneNumber}
            </p>
          )}
        </div>
      </div>

      {/* ---------------------- Employer Details Card ---------------------- */}
      <div className="mt-10 px-6 md:px-12">
        <div className="bg-white rounded-2xl shadow-lg p-6 md:p-10 space-y-6">

          {/* Name + Description */}
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-3">{employers?.name}</h2>
            <p
              className="text-gray-600 leading-relaxed text-sm md:text-base"
              dangerouslySetInnerHTML={{
                __html: employers?.description || "No Description",
              }}
            ></p>
          </div>

          {/* Info Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
            <div className="p-5 border rounded-xl bg-gray-50 shadow-sm">
              <p className="text-sm text-gray-500">Organization Type</p>
              <p className="font-semibold text-gray-800">{employers?.organizationType}</p>
            </div>

            <div className="p-5 border rounded-xl bg-gray-50 shadow-sm">
              <p className="text-sm text-gray-500">Team Size</p>
              <p className="font-semibold text-gray-800">{employers?.teamSize}</p>
            </div>

            <div className="p-5 border rounded-xl bg-gray-50 shadow-sm">
              <p className="text-sm text-gray-500">Established</p>
              <p className="font-semibold text-gray-800">{employers?.yearOfEstablishment}</p>
            </div>

            <div className="p-5 border rounded-xl bg-gray-50 shadow-sm">
              <p className="text-sm text-gray-500">Website</p>
              <a
                href={employers?.websiteUrl ?? "https://www.google.com"}
                target="_blank"
                className="font-semibold text-blue-600 hover:underline"
              >
                {employers?.websiteUrl ?? "Visit Website"}
              </a>
            </div>

            <div className="p-5 border rounded-xl bg-gray-50 shadow-sm">
              <p className="text-sm text-gray-500">Location</p>
              <p className="font-semibold text-gray-800">{employers?.location}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;