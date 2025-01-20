function SkeletonLoadingEffect({ type = "default", style = {}, className = "" }) {

  const classes = `skeleton skeleton-${type} skeleton-animation ${className}`;
  return (
    <div className={classes} style={style}>
      <div className="container"></div>
    </div>
  );
}

export default SkeletonLoadingEffect;