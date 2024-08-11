import React from "react";

const Friend = ({ params }: { params: { id: string } }) => {
  return <div>Friend {params.id}</div>;
};

export default Friend;
