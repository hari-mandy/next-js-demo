import { gql } from "@apollo/client";

export const UPDATE_ORDER_STATUS = gql`
    mutation UpdateOrderStatus($orderId: Int!, $status: OrderStatusEnum) {
        updateOrder(input: { status: $status, orderId: $orderId }) {
            order {
                id
                status
            }
        }
    }
`;
