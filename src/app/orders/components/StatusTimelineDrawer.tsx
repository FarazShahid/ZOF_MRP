import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  DrawerFooter,
  Button,
  useDisclosure,
} from "@heroui/react";
import OrderStatusTimeline from "./OrderStatusTimeline";
import useOrderStore from "@/store/useOrderStore";


const StatusTimelineDrawer = () => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const {OrderStatusLogs} = useOrderStore();
  return (
    <>
      <Button onPress={onOpen} className="">
        View Status
      </Button>

      <Drawer isOpen={isOpen} onOpenChange={onOpenChange} placement="right" size="md">
        <DrawerContent>
          {(onClose) => (
            <>
              <DrawerHeader className="flex flex-col gap-1">Status Timeline</DrawerHeader>
              <DrawerBody>
                <OrderStatusTimeline OrderStatusLogs={OrderStatusLogs} />
              </DrawerBody>
              <DrawerFooter>
                <Button variant="flat" color="danger" onPress={onClose}>
                  Close
                </Button>
              </DrawerFooter>
            </>
          )}
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default StatusTimelineDrawer;
