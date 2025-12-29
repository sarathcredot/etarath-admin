import React, { useMemo, useState } from "react";
import Breadcrumb from "src/components/common/breadcrumb";
import { Card } from "react-bootstrap";
import VendorsList from "./VendorsList";
import { useGetAllVendors } from "src/services/vendor.service";

const VendorsPage = () => {
  // STATES
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState<number>(10);
  const [search, setSearch] = useState<string>("");

  // QUERY

  //USE MEMO
  const queryObj = useMemo(() => {
    const obj: any = {};

    if (page) {
      obj.page = page;
    }

    if (limit) {
      obj.limit = limit;
    }

    if (search?.trim()) {
      console.log("searching", search);
      obj.search = search.trim()
    }

    return obj;
  }, [page, limit, search]);

  const { data, isLoading, error } = useGetAllVendors(undefined, queryObj);

  console.log("Vendors data", data);


  return (
    <>
      <Breadcrumb
        current={"Vendors"}
        paths={[
          {
            name: "Dashboard",
            url: "/dashboard",
          },
          {
            name: "vendors",
            url: "/vendors",
          },
        ]}
      />
      <Card>
        <Card.Body className="bg-white">
          <VendorsList
            vendors={data?.result || []}
            data={data}
            isLoading={isLoading}
            setPage={setPage}
            setLimit={setLimit}
            setSearch={setSearch}
            page={page}
            limit={limit}
            search={search}
          />
        </Card.Body>
      </Card>
    </>
  );
};

export default VendorsPage;
