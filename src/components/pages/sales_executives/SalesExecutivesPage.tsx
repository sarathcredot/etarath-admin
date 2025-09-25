import React from "react";
import Breadcrumb from "src/components/common/breadcrumb";
import { Card } from "react-bootstrap";
import SalesExecutivesList from "./SalesExecutivesList";

const SalesExecutivesPage = () => {
  return (
    <>
      <Breadcrumb
        current={"Sales Executives"}
        paths={[
          {
            name: "Dashboard",
            url: "/dashboard",
          },
          {
            name: "sales-executives",
            url: "/sales-executives",
          },
        ]}
      />
      <Card>
        <Card.Body className="bg-white">
          <SalesExecutivesList />
        </Card.Body>
      </Card>
    </>
  );
};

export default SalesExecutivesPage;
