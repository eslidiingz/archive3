import Link from "next/link";

const Td = ({ children, to, classStyle }) => {
  const ContentTag = to ? Link : "div";

  return (
    <td className={classStyle}>
      <ContentTag href={to}>{children}</ContentTag>
    </td>
  );
};

export default Td;
