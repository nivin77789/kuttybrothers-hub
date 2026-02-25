import { RentalLayout } from "@/components/RentalLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Orders = () => {
    return (
        <RentalLayout title="Orders">
            <Card>
                <CardHeader>
                    <CardTitle>Orders Management</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground">Manage your rental orders here.</p>
                </CardContent>
            </Card>
        </RentalLayout>
    );
};

export default Orders;
