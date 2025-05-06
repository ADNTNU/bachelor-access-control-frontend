import { Container } from "@mui/material";
import { type ComponentProps } from "react";

type ContainerProps = ComponentProps<typeof Container>;

type PageWrapperOverride = {
  paddingY?: boolean;
  noPaddingX?: boolean;
};

type PageSectionProps = ContainerProps & PageWrapperOverride;

export default function PageSection(props: PageSectionProps) {
  const {
    children,

    maxWidth = "lg",
    sx,
    paddingY = false,
    noPaddingX = false,
    ...restProps
  } = props;
  const sxWithDefaults = {
    paddingY: paddingY ? 4 : undefined,
    paddingX: noPaddingX ? 0 : undefined,
    display: "flex",
    flexDirection: "column",
    ...sx,
  } satisfies ContainerProps["sx"];

  return (
    <Container
      component="section"
      sx={sxWithDefaults}
      maxWidth={maxWidth}
      {...restProps}
    >
      {children}
    </Container>
  );
}
