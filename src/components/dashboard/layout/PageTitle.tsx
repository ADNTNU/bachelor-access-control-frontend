import { Stack, Typography } from "@mui/material";

type PageTitleProps = {
  title: string;
  description?: string;
};

export function PageTitle(props: PageTitleProps) {
  const { title, description } = props;

  return (
    <Stack direction="column" gap={1}>
      <Typography variant="h4" component="h1" fontWeight={600}>
        {title}
      </Typography>
      {description && (
        <Typography variant="body1" color="text.secondary">
          {description}
        </Typography>
      )}
    </Stack>
  );
}
