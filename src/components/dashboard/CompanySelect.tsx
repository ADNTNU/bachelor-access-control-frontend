"use client";

import { routes } from "@/routes";
import type { CompanySimpleDto } from "@models/dto/company";
import { Box, MenuItem, Select, Typography } from "@mui/material";
import { usePathname, useRouter } from "next/navigation";
import { useCallback } from "react";
import getDashboardBasePageFromPath from "./getDashboardBasePageFromPath";

type CompanySelectProps = {
  companies: CompanySimpleDto[];
  selectedCompanyId: string | null;
  onSelectCompany: "navigate" | ((company: CompanySimpleDto) => void);
};

export default function CompanySelect(props: CompanySelectProps) {
  const { companies, selectedCompanyId, onSelectCompany } = props;

  const pathname = usePathname();
  const basePageSegment = getDashboardBasePageFromPath(pathname);
  const router = useRouter();

  const handleSelectCompany = useCallback(
    (company: CompanySimpleDto) => {
      if (typeof onSelectCompany === "function") {
        onSelectCompany(company);
      }
      if (typeof onSelectCompany === "string") {
        router.push(`${routes.dashboard.home(company.id)}/${basePageSegment}`);
      }
    },
    [basePageSegment, onSelectCompany, router],
  );

  if (!companies.length) {
    return (
      <Box
      // sx={{
      //   px: 1,
      // }}
      >
        <Typography>No companies</Typography>
      </Box>
    );
  }

  if (companies.length === 1) {
    const singleCompany = companies[0];
    return (
      <Box
      // sx={{
      //   px: 1,
      // }}
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
          handleSelectCompany(selectedCompany);
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
