"use client";

import type { CompanySimpleDto } from "@models/dto/company";
import { Box, MenuItem, Select, Typography } from "@mui/material";

type CompanySelectProps = {
  companies: CompanySimpleDto[];
  selectedCompanyId: string | null;
  onSelectCompany: (company: CompanySimpleDto) => void;
};

export default function CompanySelect(props: CompanySelectProps) {
  const { companies, selectedCompanyId, onSelectCompany } = props;

  if (!companies.length) {
    return (
      <Box
        sx={{
          px: 1,
        }}
      >
        <Typography>No companies</Typography>
      </Box>
    );
  }

  if (companies.length === 1) {
    const singleCompany = companies[0];
    return (
      <Box
        sx={{
          px: 1,
        }}
      >
        <Typography>{singleCompany!.name}</Typography>
      </Box>
    );
  }

  return (
    <Select
      value={selectedCompanyId ?? ""}
      onChange={(event) => {
        const selectedId = event.target.value;
        const selectedCompany = companies.find(
          (company) => company.id.toString() === selectedId,
        );
        if (selectedCompany) {
          onSelectCompany(selectedCompany);
        }
      }}
      displayEmpty
      inputProps={{ "aria-label": "Select company" }}
      sx={{
        width: "100%",
      }}
    >
      {companies.map((company) => (
        <MenuItem key={company.id} value={company.id}>
          {company.name}
        </MenuItem>
      ))}
    </Select>
  );
}
