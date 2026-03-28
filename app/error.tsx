"use client";

type Props = {
  error: Error;
};

const Error = ({ error }: Props) => {
  return <p>Something went wrong. ${error.message}</p>;
};

export default Error;
