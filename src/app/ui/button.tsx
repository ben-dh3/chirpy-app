import Link from "next/link";

interface ButtonProps {
  link?: string;
  text: string;
  style: string;
  type?: "button" | "submit" | "reset";
}

export default function Button({ link, text, style, type = "button" }: ButtonProps) {
  const bold = {
    bg_colour: "bg-secondary-400",
    text_colour: "text-white",
    shadow: "drop-shadow-bold",
  };
  const regular = {
    bg_colour: "bg-primary-100",
    text_colour: "text-primary-400",
    shadow: "drop-shadow-regular",
  };

  const buttonStyle = style === "bold" ? bold : regular;

  const buttonClasses = `w-full p-4 rounded-2xl ${buttonStyle.shadow} ${buttonStyle.bg_colour} ${buttonStyle.text_colour}`;

  if (link) {
    return (
      <Link href={link}>
        <button className={buttonClasses} type="button">
          {text}
        </button>
      </Link>
    );
  }

  return (
    <button className={buttonClasses} type={type}>
      {text}
    </button>
  );
}