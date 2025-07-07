"use client";

import React from "react";
import Link from "next/link";
import { MdKeyboardArrowRight } from "react-icons/md";
import { Button } from "@heroui/react";
import { Form, Formik } from "formik";
import Label from "../../components/common/Label";

const ShipmentForm = () => {
  const shipmentSchema = {};
  const initialValues = {};
  const handleAdd = async () => {};
  return (
    <div>
      <div className="flex flex-col gap-2">
        <h4 className="text-lg font-bold">Add New Shipment</h4>
        <div className="flex items-center gap-1 text-xs">
          <Link href={"/shipment"}>
            <span className="">Shipment</span>
          </Link>
          <MdKeyboardArrowRight />
          <span className="">Add New Shipment</span>
        </div>
      </div>

      <div className="m-10 p-5 bg-white dark:bg-slate-900 rounded">
        <Formik
          validationSchema={shipmentSchema}
          initialValues={initialValues}
          enableReinitialize
          onSubmit={handleAdd}
        >
          {({ isSubmitting }) => (
            <Form>
              <div className="grid grid-cols-3 gap-2">
                <Label isRequired={false} label="" />
              </div>
              <div className="flex items-center justify-end gap-2">
                <Button color="danger" type="button" variant="flat">
                  Cancel
                </Button>
                <Button color="primary" type="submit" spinner={isSubmitting}>
                  Add
                </Button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default ShipmentForm;
