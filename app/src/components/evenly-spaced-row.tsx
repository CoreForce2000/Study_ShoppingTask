import React from "react";

interface EvenlySpacedRowProps {
  firstChild?: React.ReactNode;
  secondChild?: React.ReactNode;
  lastChild?: React.ReactNode;
  firstSize?: string;
  secondSize?: string;
  lastSize?: string;
}

const EvenlySpacedRow: React.FC<EvenlySpacedRowProps> = ({
  firstChild,
  secondChild,
  lastChild,
  firstSize = "flex-1",
  secondSize = "flex-1",
  lastSize = "flex-1",
}) => {
  return (
    <div className="flex items-center w-full text-[2.4em]">
      <div className={`${firstSize} text-left`}>{firstChild ?? <></>}</div>
      <div className={`${secondSize} text-center`}>{secondChild ?? <></>}</div>
      <div className={`${lastSize} text-right`}>{lastChild ?? <></>}</div>
    </div>
  );
};

export default EvenlySpacedRow;
