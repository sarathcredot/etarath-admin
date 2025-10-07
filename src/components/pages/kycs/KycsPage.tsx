import React, { useMemo, useState } from "react";
import Breadcrumb from "src/components/common/breadcrumb";
import { Card } from "react-bootstrap";
import { useGetAllVendors } from "src/services/vendor.service";
import KycsList from "./KycsList";
import { useGetAllKycRequests } from "src/services/kyc.service";

const KycsPage = () => {
  // STATES
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState<number>(10);
  const [search, setSearch] = useState<string>("");

  // QUERY
  // const { data, isLoading, error } = useGetAllVendors();
  const { data, isLoading, error } = useGetAllKycRequests();

  //USE MEMO
  const queryObj = useMemo(() => {
    const obj: any = {};

    if (page) {
      obj.page = page;
    }

    if (limit) {
      obj.limit = limit;
    }

    if (search) {
      obj.search = search;
    }

    return obj;
  }, [page, limit, search]);

  return (
    <>
      <Breadcrumb
        current={"Kyc Listing"}
        paths={[
          {
            name: "Dashboard",
            url: "/dashboard",
          },
          {
            name: "kyc",
            url: "/kyc",
          },
        ]}
      />
      <Card>
        <Card.Body className="bg-white">
          <KycsList
            vendors={data}
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

export default KycsPage;
// 