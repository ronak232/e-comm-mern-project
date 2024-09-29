function SkeletonLoadingEffect(props) {

  const classes = `skeleton ${props.text} skeleton-animation`;
  return (
    <div className={classes}>
      <div className="container"></div>
    </div>
  );
}

export default SkeletonLoadingEffect;
