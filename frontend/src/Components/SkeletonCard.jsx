import SkeletonLoadingEffect from "./SkeletonEffect";

function SkeletonCard({ layout = [] }) {
  return (
    <li className="h-full md:w-[33.3%] w-full flex flex-col">
      {layout.map((item, index) => (
        <SkeletonLoadingEffect
          key={index}
          type={item.type}
          style={item.style}
          className={item.className}
        />
      ))}
    </li>
  );
}

export default SkeletonCard;
