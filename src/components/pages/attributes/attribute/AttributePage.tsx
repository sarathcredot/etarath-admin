import React, { useEffect, useMemo, useState } from "react";
import Breadcrumb from "src/components/common/breadcrumb";
import { Card, Col, Row, Table } from "react-bootstrap";
import { toast } from "react-toastify";
import Loader from "src/components/features/loader";
import {
  Link,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";
import Pagination from "src/components/common/Pagination";
import { capitalCase } from "capital-case";
import AttributesList from "../AttributesList";
import { useGetAllAttributes } from "src/services/attribute.service";

const AttributePage = () => {
  //IMPORTS
  const { attribute } = useParams();

  console.log({ attribute });

  //STATE
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState<number>(3);
  const [search, setSearch] = useState<string>("");
  const [deleteOpen, setDeleteOpen] = useState<boolean>(false);

  //USE MEMO
  const queryObj = useMemo(() => {
    const obj: any = {
      skip: true,
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


  if (attribute === "origin") {

    queryObj.attribute = "origin"

  } else {

    queryObj.attribute = "yearOfManufacturer"
  }


  // QUERY;
  const {
    data: attributes,
    isLoading: isLoading,
    error,
  } = useGetAllAttributes(!!attribute, queryObj);

  console.log("AAAAAAAAA = ", attributes);

  return (
    <>
      <Breadcrumb
        current={attribute ? capitalCase(attribute) : "attribute"}
        paths={[
          {
            name: "Dashboard",
            url: "/dashboard",
          },
          {
            name: "attributes",
            url: "/attributes",
          },
          {
            name: attribute ? capitalCase(attribute) : "attribute",
          },
        ]}
      />
      <Card>
        <Card.Body className="bg-white">
          <AttributesList
            // attributesData={
            //   attribute === "origin"
            //     ? attributes?.origin
            //     : attribute === "year_of_manufacture"
            //     ? attributes?.yearOfManufacturer
            //     : []
            // }
            attributesData={
              attributes && attribute
                ? attribute === "origin"
                  ? attributes?.result
                  : attribute === "year_of_manufacture"
                    ? attributes?.result
                    : []
                : []
            }
            data={attributes}
            isLoading={isLoading}
            setPage={setPage}
            setLimit={setLimit}
            setSearch={setSearch}
            page={page}
            limit={limit}
            search={search}
            type={
              attribute === "origin"
                ? attribute
                : attribute === "year_of_manufacture"
                  ? "yearOfManufacturer"
                  : ""
            }
          />
        </Card.Body>
      </Card>
    </>
  );
};

export default AttributePage;
