import React, { useMemo, useState } from "react";
import Breadcrumb from "src/components/common/breadcrumb";
import { Card } from "react-bootstrap";
import RetailersList from "./RetailersListDelete";
import { useGetAllDeletedRetailers } from "src/services/retailer.service";

const VendorsPage = () => {
  // STATES
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState<number>(10);
  const [search, setSearch] = useState<string>("");
  const [status, setStatus] = useState<string>("all");
  const [isSuspend, setisSuspend] = useState<string>("all");



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

    if (status) {
      obj.status = status
    }
    if (isSuspend) {
      obj.isSuspend = isSuspend
    }

    return obj;
  }, [page, limit, search, status, isSuspend]);

  // QUERY
  const { data, isLoading, error, } = useGetAllDeletedRetailers(undefined, queryObj);



  return (
    <>
      <Breadcrumb
        current={"Deactive Retailers"}
        paths={[
          {
            name: "Dashboard",
            url: "/dashboard",
          },
          {
            name: "retailers",
            url: "/retailers",
          },
        ]}
      />
      <Card>
        <Card.Body className="bg-white">
          <RetailersList
            retailers={data?.result || []}
            data={data}
            isLoading={isLoading}
            setPage={setPage}
            setLimit={setLimit}
            setSearch={setSearch}
            setStatusU={setStatus}
            setIsSupend={setisSuspend}
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
