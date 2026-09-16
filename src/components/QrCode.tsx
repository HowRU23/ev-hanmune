import QRCode from "qrcode";

export default async function QrCode({
  value,
  size = 160,
}: {
  value: string;
  size?: number;
}) {
  const svg = await QRCode.toString(value, {
    type: "svg",
    width: size,
    margin: 1,
    color: { dark: "#171717", light: "#ffffff" },
  });

  return (
    <div
      style={{ width: size, height: size }}
      // eslint-disable-next-line react/no-danger-with-children
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
}
