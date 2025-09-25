import React, { useEffect, useMemo, useState } from "react";
import Breadcrumb from "src/components/common/breadcrumb";
import { Card } from "react-bootstrap";
// import { useGetAllTournaments } from "src/services/tournament.service";
import { toast } from "react-toastify";
import BrandsList from "./BrandsList";
import { useGetAllBrands } from "src/services/brand.service";

const BrandPage = () => {
  //STATE
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState<number>(10);
  const [search, setSearch] = useState<string>("");

  //USE MEMO
  const queryObj = useMemo(() => {
    const obj: any = {
      skip: true
    };

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

  //QUERY

  const {data:brands,isLoading,error} = useGetAllBrands()

  console.log('BRANDS = ',brands);

  useEffect(()=>{
    if(brands){
      setPage(brands?.currentPage||1);
    }
  },[brands])

  useEffect(() => {
    if (error) {
      toast(error, {
        containerId: "default",
        className: "no-icon notification-danger",
      });
    }
  }, [error]);

  return (
    <>
      <Breadcrumb
        current={"Brands"}
        paths={[
          {
            name: "Dashboard",
            url: "/dashboard",
          },
          {
            name: "brands",
            url: "/brands",
          },
        ]}
      />
      <Card>
        <Card.Body className="bg-white">
          <BrandsList
            brandsData={brands}
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

export default BrandPage;
