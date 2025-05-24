import useOrderStore, { ChangeOrderStatusType } from "@/store/useOrderStore";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  DrawerFooter,
  Button,
  Link,
  Tooltip,
  Avatar,
  AvatarGroup,
} from "@heroui/react";
import { IoIosStats } from "react-icons/io";
import { MdCancel } from "react-icons/md";
import { FaFileImage } from "react-icons/fa6";
import { useEffect, useState } from "react";
import OrderDeadline from "./OrderDeadline";
import UpdateOrderStatus from "./UpdateOrderStatus";
import PriorityChip from "./PriorityChip";

export interface ViewDrawerComponentProps {
  isOpen: boolean;
  Id: number;
  onClose: () => void;
}

const ViewDrawer: React.FC<ViewDrawerComponentProps> = ({
  isOpen,
  onClose,
  Id,
}) => {
  const { getOrderById, changeOrderStatus, OrderById } = useOrderStore();
  const [selectedStatusId, setSelectedStatusId] =
    useState<ChangeOrderStatusType>();

  const handleStatusChange = (statusId: number) => {
    setSelectedStatusId({
      id: OrderById.Id,
      statusId: statusId,
    });
  };

  useEffect(() => {
    if (Id > 0) {
      getOrderById(Id);
    }
  }, [Id, isOpen]);

  useEffect(() => {
    if (selectedStatusId) {
      changeOrderStatus(selectedStatusId);
    }
  }, [selectedStatusId]);

  return (
    <>
      <Drawer
        hideCloseButton
        backdrop="blur"
        classNames={{
          base: "data-[placement=right]:sm:m-2 data-[placement=left]:sm:m-2  rounded-medium",
        }}
        isOpen={isOpen}
        onOpenChange={onClose}
      >
        <DrawerContent>
          {(onClose) => (
            <>
              <DrawerHeader className="absolute top-0 inset-x-0 z-50 flex flex-row gap-2 px-2 py-2 border-b border-default-200/50 justify-between bg-content1/50 backdrop-saturate-150 backdrop-blur-lg">
                <div className="w-full flex justify-start gap-2">
                  <h6>{OrderById.OrderName}</h6>
                </div>
                <Tooltip content="Close">
                  <Button
                    isIconOnly
                    className="text-default-400"
                    size="sm"
                    variant="light"
                    onPress={onClose}
                  >
                    <MdCancel size={25} />
                  </Button>
                </Tooltip>
              </DrawerHeader>
              <DrawerBody className="pt-16">
                {/* <div className="flex w-full justify-center items-center pt-4">
                  <Image
                    isBlurred
                    isZoomed
                    alt="Event image"
                    className="aspect-square w-full hover:scale-110"
                    height={300}
                    src="https://nextuipro.nyc3.cdn.digitaloceanspaces.com/components-images/places/san-francisco.png"
                  />
                </div> */}
                <div className="flex flex-col gap-2 py-4">
                  <h1 className="text-2xl font-bold leading-7">
                    {OrderById.OrderNumber}
                  </h1>
                  <p className="text-sm text-default-500">
                    {OrderById.ClientName}, {OrderById.EventName}
                  </p>
                  <div className="mt-4 flex flex-col gap-3">
                    <OrderDeadline deadline={OrderById.Deadline} />
                    <div className="flex gap-3 items-center">
                      <div className="flex items-center justify-center border-1 border-default-200/50 rounded-small w-11 h-11">
                        <IoIosStats size={18} />
                      </div>
                      <UpdateOrderStatus
                        statusName={OrderById.StatusName}
                        onChangeStatus={(statusId) =>
                          handleStatusChange(statusId)
                        }
                      />
                    </div>
                    <div className="flex flex-col mt-4 gap-3 items-start">
                      <div className="text-medium font-medium flex items-center gap-2">
                        Order Items
                        <div className="bg-blue-300 rounded-lg px-1 text-xs text-black">
                          {OrderById?.items?.length || 0}
                        </div>
                      </div>
                      <div className="text-medium text-default-500 flex flex-col gap-2">
                        {OrderById?.items.map((orderItem, index) => {
                          return (
                            <div
                              className="flex flex-col gap-1 rounded-lg p-3 shadow-2xl"
                              key={index}
                            >
                              <div className="flex items-center gap-1">
                                <p className="">
                                  {orderItem?.ProductCategoryName}_
                                  {orderItem?.ProductFabricType}_
                                  {orderItem?.ProductFabricName}_
                                  {orderItem?.ProductFabricGSM}
                                </p>
                              </div>

                              <div className="">
                                {orderItem?.orderItemDetails?.map(
                                  (orderDetail, index) => {
                                    return (
                                      <div className="grid grid-cols-3 gap-2" key={index}>
                                        <div className="flex items-center gap-3 text-xs">
                                          <p className="">Color:</p>
                                          <span>
                                            {orderDetail?.ColorOptionName}
                                          </span>
                                        </div>
                                        <div className="flex items-center gap-3 text-xs">
                                          <p className="">Quantity:</p>
                                          <span>{orderDetail?.Quantity}</span>
                                        </div>
                                        <div className="flex items-center gap-3 text-xs">
                                          <p className="">Priority: </p>
                                          <PriorityChip
                                            priority={orderDetail?.Priority}
                                          />
                                        </div>
                                      </div>
                                    );
                                  }
                                )}
                              </div>
                              <div className="flex items-center gap-1 text-xs">
                                <span className="font-bold mr-3">
                                  Printing Options:
                                </span>
                                {orderItem?.printingOptions?.map(
                                  (printingOptions, index) => {
                                    return (
                                      <span key={index}>
                                        {printingOptions?.PrintingOptionName}
                                      </span>
                                    );
                                  }
                                )}
                              </div>
                            </div>
                          );
                        })}
                        {/* <p>
                          Hey Bay Area! We are excited to announce our next
                          meetup on Tuesday, November 19th.
                        </p>
                        <p>
                          Join us for an evening of insightful discussions and
                          hands-on workshops focused on the latest developments
                          in web development and design. Our featured speakers
                          will share their experiences with modern frontend
                          frameworks, responsive design patterns, and emerging
                          web technologies. You&apos;ll have the opportunity to
                          network with fellow developers and designers while
                          enjoying refreshments and snacks.
                        </p>
                        <p>
                          During the main session, we&apos;ll dive deep into
                          practical examples of building scalable applications,
                          exploring best practices for component architecture,
                          and understanding advanced state management
                          techniques. Our interactive workshop portion will let
                          you apply these concepts directly, with experienced
                          mentors available to provide guidance and answer your
                          questions. Whether you&apos;re a seasoned developer or
                          just starting your journey, you&apos;ll find valuable
                          takeaways from this session.
                        </p>

                        <p className="mt-4">
                          Brought to you by the{" "}
                          <Link
                            className="text-default-700"
                            href="https://heroui.com"
                          >
                            HeroUI team
                          </Link>
                          .
                        </p> */}
                      </div>
                    </div>
                    <div className="flex flex-col mt-4 gap-3 items-start">
                      <span className="text-small text-default-500">
                        Attachments
                      </span>
                      <div className="flex flex-wrap gap-2 items-center">
                        <div className="flex gap-2 bg-gray-dark p-2 rounded-lg cursor-pointer">
                          <FaFileImage />
                          <span className="text-xs">Design File</span>
                        </div>
                        <div className="flex gap-2 bg-gray-dark p-2 rounded-lg cursor-pointer">
                          <FaFileImage />
                          <span className="text-xs">Jersy No.</span>
                        </div>
                      </div>
                    </div>
                    {/* <div className="flex flex-col mt-4 gap-3 items-start">
                      <span className="text-small text-default-500">
                        105 Going
                      </span>
                      <div className="flex gap-2 items-center">
                        <AvatarGroup
                          isBordered
                          classNames={{
                            base: "pl-2",
                            count: "text-default-500 text-tiny bg-default-100",
                          }}
                          size="sm"
                          total={101}
                        >
                          <Tooltip content="Alex">
                            <Avatar
                              className="data-[hover=true]:!translate-x-0"
                              name="Alex"
                              src="https://i.pravatar.cc/150?u=a04258114e29026708c"
                            />
                          </Tooltip>
                          <Tooltip content="Joe">
                            <Avatar
                              className="data-[hover=true]:!translate-x-0"
                              name="Joe"
                              src="https://i.pravatar.cc/150?u=a04258114e290267084"
                            />
                          </Tooltip>
                          <Tooltip content="John">
                            <Avatar
                              className="data-[hover=true]:!translate-x-0"
                              name="John"
                              src="https://i.pravatar.cc/150?u=a04258a2462d826712d"
                            />
                          </Tooltip>
                          <Tooltip content="Jane">
                            <Avatar
                              className="data-[hover=true]:!translate-x-0"
                              name="Jane"
                              src="https://i.pravatar.cc/150?u=a04258114e29026702d"
                            />
                          </Tooltip>
                        </AvatarGroup>
                      </div>
                    </div> */}
                  </div>
                </div>
              </DrawerBody>
              <DrawerFooter className="flex flex-col gap-1">
                {/* <Link
                  className="text-default-400"
                  href="mailto:hello@heroui.com"
                  size="sm"
                >
                  Contact the host
                </Link>
                <Link
                  className="text-default-400"
                  href="mailto:hello@heroui.com"
                  size="sm"
                >
                  Report event
                </Link> */}
              </DrawerFooter>
            </>
          )}
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default ViewDrawer;
