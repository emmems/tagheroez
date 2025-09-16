'use client'

import { SearchInput } from "@/components/search-input";
import { useUrlSearchParams } from "@/lib/use.search.params";
import { rpcProvider, useQuery } from "@/src/api/rpc.provider";
import { useState } from "react";
import { useDebouncedCallback } from 'use-debounce';
import ParentsTable from "./parents-table";

type SearchParamsType = {
  search: string;
};

function ParentsSection() {
  // TODO only role Parents :)

  const [params, setParams] = useUrlSearchParams(
    { search: "" } as SearchParamsType,
    { search: String },
  );
  const [inputValue, setInputValue] = useState(String(params.search ?? ""));

  const {
     data: parentsResult,
     isFetching: isParentsLoading,
   } = useQuery(
     rpcProvider.userRouter.getUsers,
     // TODO fix later
     // {
     //   search: String(params.search ?? ''),
     // },
     // {
     //   enabled: !!params.search,
     // }
   );

  const debouncedSetParams = useDebouncedCallback((value: string) => {
    setParams({ search: value });
  }, 300);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setInputValue(value);
      debouncedSetParams(value);
  };

  const parents = parentsResult?.users ?? [];
  console.log("parents: ", parents);

  return (
    <section className="space-y-6">
      <SearchInput
        placeholder="Search parents by name, email or phone..."
        value={inputValue}
        onChange={handleInputChange}
      />
      <ParentsTable
        parents={parents}
        isParentsLoading={isParentsLoading}
      />
    </section>
  )
}

export default ParentsSection;
