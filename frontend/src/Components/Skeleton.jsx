import SkeletonLoadingEffect from "./SkeletonEffect";

function SkeletonCard() {
  return (
    <li className="h-full w-full container flex flex-col">
      <SkeletonLoadingEffect text="username" />
      <SkeletonLoadingEffect text="comment" />
      <SkeletonLoadingEffect text="expression" />
    </li>
  );
}

export default SkeletonCard;
