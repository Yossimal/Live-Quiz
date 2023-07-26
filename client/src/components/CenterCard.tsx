import React from "react";

type CenterCardProps = {
  children: React.ReactNode;
};

export default function CenterCard({ children }: CenterCardProps) {
  return (
    <div className="flex align-items-center justify-content-center">
      <div className="surface-card p-5 mt-3 shadow-2 border-round w-full lg:w-6">
        <div className="text-center mb-5">{children}</div>
      </div>
    </div>
  );
}
