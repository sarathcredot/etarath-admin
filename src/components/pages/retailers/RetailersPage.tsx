import React, { useMemo, useState } from "react";
import Breadcrumb from "src/components/common/breadcrumb";
import { Card } from "react-bootstrap";
import RetailersList from "./RetailersList";
import { useGetAllRetailers } from "src/services/retailer.service";

const VendorsPage = () => {
  // STATES
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState<number>(10);
  const [search, setSearch] = useState<string>("");

  // QUERY
  const { data, isLoading, error } = useGetAllRetailers();

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
        current={"Retailers"}
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
            retailers={data}
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
