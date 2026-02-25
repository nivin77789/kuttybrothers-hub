import { RentalLayout } from "@/components/RentalLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ClipboardList } from "lucide-react";

const ListOrders = () => {
    return (
        <RentalLayout title="List Orders">
            <div className="space-y-6">
                <Card className="border-white/5 bg-card/40 backdrop-blur-xl">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <ClipboardList className="h-6 w-6 text-primary" />
                            Archived Orders
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground">Historical list of all completed and pending rental orders.</p>
                    </CardContent>
                </Card>
            </div>
        </RentalLayout>
    );
};

export default ListOrders;
