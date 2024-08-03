import React from "react";

const AuthLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <main className="h-full flex justify-center items-center">
      <div>
        <div className="my-28 md:hidden" />
        {children}
        <div className="my-10 md:hidden" />
      </div>
    </main>
  );
};

export default AuthLayout;
