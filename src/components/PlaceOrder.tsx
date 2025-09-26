import React, { useState, useContext } from 'react'
import { checkoutContext } from '@/context/checkoutContext'
import { useOrderService } from '@/hooks/useOrderService'
import { useShoppingCart } from 'use-shopping-cart'
import { CREATE_ORDER } from '@/queries/create-order'
import { UPDATE_ORDER_STATUS } from '@/queries/update-order'
import { useMutation } from '@apollo/client'

type OrderInput = {
  billing: {
    firstName: string
    lastName: string
    address1: string
    city: string
    postcode: string
    country: string
    email: string
    phone: string
  }
  shipping: {
    firstName: string
    lastName: string
    address1: string
    city: string
    postcode: string
    country: string
  }
  paymentMethod: string
  lineItems: {
    productId: number
    quantity: number
    variationId?: number | null
  }[]
  shippingLines: {
    methodId: string
    methodTitle: string 
    total: string
  }[]
  status: string
}


const PlaceOrder = () => {
    const { checkoutDetails } = useContext(checkoutContext);
    const [enable, setEnable] = useState<string>('Place Order');
    const { cartDetails, clearCart } = useShoppingCart();
    const [alertMessage, setAlertMessage] = useState<string>('');
    const [createOrderMutation] = useMutation(CREATE_ORDER);
    const [updateOrderMutatioin] = useMutation(UPDATE_ORDER_STATUS);

    console.log(cartDetails);

    const handlePlaceOrder = async () => {

        // fields Validation.
        if ( !checkoutDetails?.name || !checkoutDetails?.email || !checkoutDetails?.address || !checkoutDetails?.city || !checkoutDetails?.zip || !checkoutDetails?.mobilenumber) {
            setAlertMessage('Please Fill the billing Details !');
            return;
        }

        if ( !checkoutDetails?.shippingMethodId ) {
            setAlertMessage('Please select the shipping Method !');
            return;
        }

        if ( !checkoutDetails?.paymentMethodId ) {
            setAlertMessage('Please Select the Payment Method !');
            return;
        }

        setEnable('Placing order...')

        // Prepare line items from cart
        const lineItems = Object.values(cartDetails ?? {}).map((item: any) => ({
            productId: item.productId, 
            name: item.name,
            quantity: item.quantity,
            variationId: item.variationId || null
        }));
        
        // Prepare billing & shipping
        const billing = {
            firstName: checkoutDetails.name,
            address1: checkoutDetails.address,
            city: checkoutDetails.city,
            postcode: checkoutDetails.zip,
            country: "IN", // change if needed
            email: checkoutDetails.email,
            phone: checkoutDetails.mobilenumber,
        };

        const shipping = {
            firstName: checkoutDetails.shippingName || checkoutDetails.name,
            address1: checkoutDetails.shippingAddress || checkoutDetails.address,
            city: checkoutDetails.shippingCity || checkoutDetails.city,
            postcode: checkoutDetails.shippingZip || checkoutDetails.zip,
            country: "IN",
            phone: checkoutDetails.shippingMobile || checkoutDetails.mobilenumber,
        };

        // Prepare shipping lines
        const shippingLines = [
            {
                methodId: checkoutDetails.shippingMethodId || "",
                methodTitle: checkoutDetails.shippingMethodTitle || "",
                total: checkoutDetails.shippingCost?.toString() || null,
            },
        ];

        // Call createOrder mutation
        const order = await createOrderMutation({
            variables: {
                billing,
                shipping,
                paymentMethod: checkoutDetails.paymentMethodId,
                lineItems,
                shippingLines,
                status: "PENDING",
            },
        });

        const updateOrder = await updateOrderMutatioin({
            variables: {
                orderId: order?.data?.createOrder?.order?.databaseId,
                status: "PROCESSING"
            }
        })
        
        if (updateOrder.data.updateOrder.order.status === "PROCESSING") {
            alert('Order Placed Successfully with order id' + order?.data?.createOrder?.order?.databaseId);
            clearCart();
            return;
        }

        alert('Unable to place your order')
  }

  return (
        <div className='mt-5'>
            {alertMessage && <p className='text-red-500 p-3 mb-3 bg-red-100 text-center rounded-md'>{alertMessage}</p>}
            <button
                onClick={handlePlaceOrder}
                className={`w-full font-bold py-3 px-4 rounded transition duration-500 ease-in-out bg-blue-500 hover:bg-blue-700 text-white`}
                >
                   {enable}
            </button>
        </div>
      )
}

export default PlaceOrder
