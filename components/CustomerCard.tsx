import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface CustomerCardProps {
  customer: {
    name: string;
    email: string;
    address: string;
  };
}

const CustomerCard = ({ customer }: CustomerCardProps) => {
  return (
    <Card className="w-full max-w-sm mx-auto">
      <CardHeader>
        <div className="flex items-center space-x-4">
          <Avatar className="w-12 h-12">
            <AvatarImage
              src="https://i.pravatar.cc/150?u=a04258a2462d826712d"
              alt="Customer avatar"
            />
            <AvatarFallback>{customer.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <p className="text-sm font-medium leading-none">
              Customer Information
            </p>
            <h4 className="text-xl font-bold mt-1">{customer.name || "N/A"}</h4>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <p className="text-sm">
            <span className="font-semibold">Email:</span>{" "}
            {customer.email || "N/A"}
          </p>
          <p className="text-sm">
            <span className="font-semibold">Address:</span>{" "}
            {customer.address || "Not provided"}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default CustomerCard;
