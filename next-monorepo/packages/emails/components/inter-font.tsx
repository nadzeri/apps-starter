import { Font } from "@react-email/components";

export function InterFont() {
  return (
    <Font
      fontFamily="Inter"
      fallbackFontFamily="Verdana"
      webFont={{
        url: "https://fonts.gstatic.com/s/inter/v18/UcCo3FwrK3iLTcviYwYZ8UA3.woff2",
        format: "woff2",
      }}
      fontWeight={400}
      fontStyle="normal"
    />
  );
}
