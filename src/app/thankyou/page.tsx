import React from 'react'
import Link from 'next/link';

const ThankYouPage = () => {
    const orderId = 123456;
  return (
    <div className=' min-h-screen flex item-center justify-center'>
      <div className='max-w-3xl m-auto text-center p-5 border border-orange-500 bg-orange-100'>
        <h1> Thank you for your order !</h1>
        <h5> You Order is place successfully ! <br></br>For more details check your E-mail </h5>
        <p className='text-blue-500'><Link href="/shop" className='underline'> click here to shop Page </Link></p>
      </div>
    </div>
  )
}

export default ThankYouPage
