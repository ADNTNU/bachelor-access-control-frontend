"use client";

import type { Company } from "@models/backend/company";
import { Box, MenuItem, Select, Typography } from "@mui/material";

type CompanySelectProps = {
  companies: Company[];
  selectedCompanyId: string | null;
  onSelectCompany: (company: Company) => void;
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
          (company) => company.id === selectedId,
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
