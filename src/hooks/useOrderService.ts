// src/hooks/useOrderService.ts
import { useMutation } from '@apollo/client';
import { CREATE_ORDER_MUTATION } from '../queries/order-mutations';
import { CreateOrderInput, CreateOrderResponse } from '../types/order';

interface CartItem {
  id: string;
  name: string;
  quantity: number;
  value: number;
  product_data?: {
    databaseId?: number;
  };
}

interface CheckoutFormData {
  name: string;
  email: string;
  mobilenumber: string;
  address: string;
  city: string;
  zip: string;
  shippingName?: string;
  shippingMobile?: string;
  shippingAddress?: string;
  shippingCity?: string;
  shippingZip?: string;
}

export const useOrderService = () => {
  const [createOrderMutation, { loading, error, data }] = useMutation<CreateOrderResponse>(
    CREATE_ORDER_MUTATION,
    {
      onCompleted: (data) => {
        console.log('Order created successfully:', data);
      },
      onError: (error) => {
        console.error('Order creation failed:', error);
      }
    }
  );

  const createOrder = async (
    cartItems: CartItem[],
    formData: CheckoutFormData,
    selectedPaymentMethod: string,
    paymentMethodTitle: string,
    selectedShippingMethod?: string,
    shippingMethodTitle?: string,
    shippingCost?: string
  ) => {
    try {
      // Prepare line items
      const lineItems = cartItems.map(item => ({
        productId: item.product_data?.databaseId || parseInt(item.id),
        quantity: item.quantity,
      }));

      // Prepare billing address
      const billing = {
        firstName: formData.name.split(' ')[0] || formData.name,
        lastName: formData.name.split(' ').slice(1).join(' ') || '',
        email: formData.email,
        phone: formData.mobilenumber,
        address1: formData.address,
        city: formData.city,
        postcode: formData.zip,
        country: 'IN', // Adjust as needed
        state: '', // Add if you collect state
      };

      // Prepare shipping address
      const shipping = formData.shippingAddress ? {
        firstName: formData.shippingName?.split(' ')[0] || formData.shippingName || formData.name.split(' ')[0],
        lastName: formData.shippingName?.split(' ').slice(1).join(' ') || formData.name.split(' ').slice(1).join(' ') || '',
        phone: formData.shippingMobile || formData.mobilenumber,
        address1: formData.shippingAddress,
        city: formData.shippingCity || formData.city,
        postcode: formData.shippingZip || formData.zip,
        country: 'IN',
        state: '',
      } : billing;

      // Prepare shipping lines
      const shippingLines = selectedShippingMethod ? [{
        methodId: selectedShippingMethod,
        methodTitle: shippingMethodTitle || 'Standard Shipping',
        total: shippingCost || '0',
      }] : [];

      const orderInput: CreateOrderInput = {
        clientMutationId: `create-order-${Date.now()}`,
        billing,
        shipping,
        lineItems,
        shippingLines,
        paymentMethod: selectedPaymentMethod,
        paymentMethodTitle,
        status: 'PENDING', // or 'PROCESSING'
        setPaid: selectedPaymentMethod === 'cod' ? false : false, // Set to true for paid orders
      };

      const result = await createOrderMutation({
        variables: {
          input: orderInput
        }
      });

      return result.data?.createOrder.order;
    } catch (error) {
      console.error('Error creating order:', error);
      throw error;
    }
  };

  return {
    createOrder,
    loading,
    error,
    orderData: data?.createOrder.order
  };
};