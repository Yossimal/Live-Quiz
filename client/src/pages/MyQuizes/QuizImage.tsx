import css from "./quiz-image.module.css";

type QuizImageProps = {
  src: string;
  alt?: string;
  className?: string;
  icon?: string;
  onClick?: FullFunciton<void, []>;
  size?: string;
  mdSize?: string;
  smSize?: string;
};

export default function QuizImage({
  src,
  alt,
  icon,
  onClick,
  mdSize,
  smSize,
  size,
}: QuizImageProps) {
  const sz = size ?? "100%";
  const szMd = mdSize ?? sz;
  const szSm = smSize ?? szMd;
  const cssVars: any = {
    "--size": sz,
    "--size-md": szMd,
    "--size-sm": szSm,
  };
  return (
    <div className={css.wrapper}>
      <img
        style={cssVars}
        className={`${css.image}`}
        onClick={onClick}
        alt={alt}
        src={src}
      />
      {
        //put the icon on the center of the image
        icon && (
          <div className={css.icon}>
            <i className={icon} style={{ fontSize: "200%" }} />
          </div>
        )
      }
    </div>
  );
}
