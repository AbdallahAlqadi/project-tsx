import React, { useReducer, useState } from "react";
import '../style/home.css';
import Button from '@mui/material/Button';
import CloseIcon from '@mui/icons-material/Close';
import LocalMallIcon from '@mui/icons-material/LocalMall';
import { Modal,IconButton ,Badge,Box, Snackbar, Alert, TextField } from '@mui/material';
import { parse, isFuture, isToday } from 'date-fns';
import { useFormik } from 'formik';
import { css, keyframes } from '@emotion/react';
import * as yup from 'yup';
import salat_home from '../img/salat_home.png';
import about from '../img/about.jpg';
import plate1 from '../img/plate1.png';
import plate2 from '../img/plate2.png';
import plate3 from '../img/plate3.png';
import plate4 from '../img/plate4.jpg';
import plate5 from '../img/plate5.jpg';
import plate6 from '../img/plate6.jpg';
import plate7 from '../img/plate7.jpg';
import plate8 from '../img/plate8.jpg';
import z1 from '../img/z1.jpeg';
import z2 from '../img/z2.jpeg';
import z3 from '../img/z3.jpeg';
import z4 from '../img/z4.jpeg';
import z5 from '../img/z5.jpeg';
import z8 from '../img/z8.jpeg';
import z7 from '../img/z7.jpeg';
import z9 from '../img/z9.jpeg';

// يمثل تفاصيل كل عنصر
interface Item {
  name: string;
  price: string;
  quantity?: number;
  image?: string; 
}

// يمثل تفاصيل الطلب نفسه
interface Order {
  orderNumber: number;
  orderTime: string;
  items: Item[];
  totalAmount: number;
}



//كود خاص بpayment
const validationSchema = yup.object({
  cardNumber: yup
    .string()
    .required('Card Number is required')
    .matches(/^[0-9]+$/, 'Card Number must contain only numbers'), // يحقق أن رقم البطاقة يحتوي على أرقام فقط
    expiryDate: yup
    .string()
    .required('Expiry Date is required')
    .test('expiryDate', 'Expiry Date is not valid', function(value) {
      if (!value) return false;
      const parsedDate = parse(value, 'MM/yy', new Date());
      const today = new Date();
      return parsedDate > today;
    }),
  cvv: yup
    .string()
    .required('CVV is required')
    .matches(/^[0-9]{3}$/, 'CVV is not valid'), // يحقق أن CVV يحتوي على 3 أرقام
});


// بحتوي على نوع العمليات يلي بتصير داخل السلله
type ActionType = 
  | { type: 'ADD_TO_CART'; payload: Item }
  | { type: 'REMOVE_FROM_CART'; payload: number }
  | { type: 'UPDATE_QUANTITY'; payload: { index: number; quantity: number } }
  | { type: 'CLEAR_CART' };


  //مسؤول عن عمليات الزياده والنقصان والحذف والصوره في كل عنصر
const initialState: Item[] = [];
const CartItem: React.FC<{ item: Item; onRemove: () => void; onIncrease: () => void; onDecrease: () => void }> = ({ item, onRemove, onIncrease, onDecrease }) => {
  return (
    <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #ddd', borderRadius: '8px', padding: '8px', marginBottom: '8px' }}>
      {item.image && <img src={item.image} alt={item.name} style={{ width: '50px', height: '50px', objectFit: 'cover', marginRight: '8px' }} />}
      <div style={{ flex: 1 }}>
        <span>{item.name} - {item.price} - Quantity: </span>
        <Button onClick={onDecrease} style={{ color: 'green' }}>-</Button>
        <span>{item.quantity || 1}</span>
        <Button onClick={onIncrease} style={{ color: 'green'}}>+</Button>
        <Button onClick={onRemove} style={{ color: 'red' }}>Remove</Button>
      </div>
    </div>
  );
};




function reducer(state: Item[], action: ActionType): Item[] {
  // تعمل حسب نوع action
  switch (action.type) {
    //جزئيه add بحال كان المنتج بالسله بتزيد عدده غير هيك بتضيفه على السله
    case 'ADD_TO_CART':
      const existingItemIndex = state.findIndex(item => item.name === action.payload.name);
      // إذا كان existingItemIndex أكبر من -1، فهذا يعني أن العنصر موجود بالفعل في سلة 
      if (existingItemIndex > -1) {
        return state.map((item, index) => 
          index === existingItemIndex ? { ...item, quantity: (item.quantity ?? 0) + 1 } : item
        );

      } 
      // إضافة العنصر إذا لم يكن موجودًا
      else {
        return [...state, { ...action.payload, quantity: 1 }];
      }
      // تقوم بإزالة العنصر من السلة
    case 'REMOVE_FROM_CART':
      return state.filter((_, index) => index !== action.payload);
      // تقوم بتحديث كمية العنصر
    case 'UPDATE_QUANTITY':
      return state.map((item, index) =>
        index === action.payload.index ? { ...item, quantity: action.payload.quantity } : item
      );
      // إفراغ السلة
    case 'CLEAR_CART':
      return [];
    default:
      return state;
  }
}


//الكود الرئيسي
const Home: React.FC = () => {

//بتاكد من صحه البيانات الخاصه ب payment
  const formik = useFormik({
    initialValues: {
      cardNumber: '',
      expiryDate: '',
      cvv: '',
    },
    validationSchema: validationSchema,
    //تستدعى اذا البيانات صحيحه
    onSubmit: (values) => {
      confirmPayment(values);
    },
  });

  //بتنزلني على جزئيه card
  const cardsRef = React.useRef<HTMLDivElement>(null);
  const scrollToCards = () => {
    if (cardsRef.current) {
      cardsRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

//cart:  حاله عربه التسوق,dispatch:بتقوم بالتعديل على بيانات عربه التسوق
  const [cart, dispatch] = useReducer(reducer, initialState);
  //تمثل قائمه الطلبات
  const [orders, setOrders] = useState<Order[]>([]);

  //خاص بعدد الطلبات
  const [orderCount, setOrderCount] = useState(0);
  //لفتح  واغلاق عربه التسوق
  const [isCartModalOpen, setIsCartModalOpen] = useState(false);
  //خاصه ب message
  const [message, setMessage] = useState<string | null>(null);
  //متعلقه ب كود الخصم
  const [discountCode, setDiscountCode] = useState('');
  //متعلقه بقيمه الخصم
  const [discountAmount, setDiscountAmount] = useState(0);
  //متعلقه بفتح واغلاق جزئيه الدفع
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

// isLoggedIn  true or false  بتحقق من قيمه
  const isLoggedIn = Boolean(localStorage.getItem('isLoggedIn'));
  // بتضيف card على السله
  const addToCart = (item: Item) => {
    //اذا ما في اي حساب بطبع هاي الجمله
    if (!isLoggedIn) {
      alert('Please log in to add items to your cart.');
      return;
    }
    //غير هيك بضيف على السله
    dispatch({ type: 'ADD_TO_CART', payload: item });
  };

  // بعمل تحديث على عدد المنتجات التي في السله
  const updateQuantity = (index: number, quantity: number) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { index, quantity } });
  };

// غير هيك بفتح جزئيه الدفع Your cart is empty.  بتاكد اذا السله فاضيه او لا  بحال كانت فضيه بطبع
  const placeOrder = () => {
    if (cart.length === 0) {
      setMessage('Your cart is empty.');
      return;
    }
      setIsPaymentModalOpen(true);
  };

  // تاخذ المعلومات المدخله في عمليه الدفع
  const confirmPayment = (values: { cardNumber: string; expiryDate: string; cvv: string }) => {
// رقم الفاتوره
    const orderNumber = orderCount + 1;
    // الوقت الحالي
    const currentTime = new Date().toLocaleString();
    // مجموع الفاتوره
    const totalAmount = cart.reduce((total, item) => total + parseFloat(item.price.replace('JD', '')) * (item.quantity ?? 1), 0);
    // القيمه النهائيه بعد الخصم
    const finalAmount = totalAmount - discountAmount;

  
    // بتعدل على المبلغ النهائي بحيث كان بالسالب تخليه 0
    const adjustedFinalAmount = Math.max(finalAmount, 0);
  

    // بقوم بانشاء طلب جديد
    const aggregatedOrder: Order = {
      orderNumber,
      orderTime: currentTime,
      items: [...cart],
      totalAmount: adjustedFinalAmount
    };

    // يتم تحديث قائمة الطلبات السابقة بإضافة الطلب الجديد في حال تم الطلب بشكل صحيح
    setOrders(prevOrders => [...prevOrders, aggregatedOrder]);
    // بعدل على رقم الطلب
    setOrderCount(orderNumber);
    // بفضي السله
    dispatch({ type: 'CLEAR_CART' });
    // بغلق السله
    setIsCartModalOpen(false);
    // بغلق جزئيه الدفع
    setIsPaymentModalOpen(false);  
    // إظهار رسالة تؤكد إتمام الطلب بنجاح مع عرض المبلغ النهائي بعد الخصم
    setMessage(`Order placed successfully! Final amount after discount: ${adjustedFinalAmount.toFixed(2)} JD`);
  };


  //بتغلق السله اذا فاتحه
  const toggleCartModal = () => {
    setIsCartModalOpen(!isCartModalOpen);
  };

  // بتعدل على شكل سله التسوق
  const cartModalStyle = {
    position: 'fixed',  
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '80%',  
    maxWidth: 633,  
    maxHeight: '80vh',  
    overflowY: 'auto',
    backgroundColor: '#fff',  
    borderRadius: '8px', 
    border: '1px solid #ddd',  
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)', 
    padding: '16px', 
    zIndex: 1300,  
  };
  


  // بتعدل على شكل جزئيه الدفع
  const paymentModalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '80%',
    maxWidth: '400px',
    bgcolor: '#ffffff', 
    border: '1px solid #ccc',
    boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.2)',
    p: 3,
    borderRadius: '12px', 
    overflow: 'hidden',
  };
  
  
// السله animation متعلق بالمنتجات التي في السله
  const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;
// animation
const slideIn = keyframes`
  from {
    transform: translateY(20px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
`;

// Styles for modal
// animation
const modalStyle = css`
  animation: ${fadeIn} 0.3s ease-in;
`;

// Styles for cart item
// animation
const cartItemStyle = css`
  animation: ${slideIn} 0.5s ease-out;
`;

  return (
    <div className="body">
      {/* Grid and Sections */}
      <div className="grid1">
        <div className="secssion1">
          <h1 id='text1'>Tasty food <br /> and healthy.</h1>
          <h1 id='text2'>Try the best <br />food of the week.</h1>
          <Button onClick={scrollToCards} style={{ background: 'green', borderRadius: '18px', fontSize: 'large', marginLeft: '540px' }} variant="contained" className='button1'>View Menu</Button>
        </div>
        <div className="secssion2">
          <img id='imgsec2' src={salat_home} alt="Salad" />
        </div>
      </div>

      <div className="grid2">
        <div className="secssion3">
          <img id='img3' src={about} alt="About Us" />
        </div>
        <div className="secssion4">
          <h1 id='text3'>About us</h1>
          <h1 id='text4'>We cook the best <br />tasty food</h1>
          <h3 id='text5'>We cook the best food in the entire city, with excellent<br /> customer service, the best meals and at<br /> the best price, visit us.</h3>
        </div>
      </div>

      <h1 id='text6'>Special</h1>
      <h1 id='text7'>Menu of the week for foods.</h1>

      <div ref={cardsRef} className='cards'>
        {/* Food Items */}
        {[
          { id: 'plate1', name: 'Barbecue salad', price: '3.00JD', src: plate1 },
          { id: 'plate2', name: 'Salad with fish', price: '2.00JD', src: plate2 },
          { id: 'plate3', name: 'Spinach salad', price: '2.50JD', src: plate3 },
          { id: 'plate4', name: 'Salmon salad', price: '5.00JD', src: plate4 },
          { id: 'plate5', name: 'Pasta', price: '3.00JD', src: plate5 },
          { id: 'plate6', name: 'Grilled chicken', price: '4.00JD', src: plate6 },
          { id: 'plate7', name: 'Pancakes', price: '3.00JD', src: plate7 },
          { id: 'plate8', name: 'Fruit Salad', price: '5.00JD', src: plate8 }
          // بتنشا كل card
        ].map((item, index) => (
          <div id='card' key={index}>
           <img id='imgcard' src={item.src} alt={item.name} />
    <h2 id='textcard1'>{item.name}</h2>
    <h4 id='textcard2'>{item.price}</h4>
    <Button 
  variant="contained" 
  sx={{
    color: 'green',
    backgroundColor: 'white',
    border: '1px solid green',
    width: '250px',
    marginLeft: '25px',
    '&:hover': {
      backgroundColor: 'green', 
      color: 'white', 
    },
  }} 
  onClick={() => addToCart({ name: item.name, price: item.price, image: item.src })}
>
  ADD TO ORDER
</Button>
          </div>
        ))}
      </div>

      <h1 id='text6'>Special</h1>
      <h1 id='text7'>Menu of the week for juices.</h1>

      <div className='cards'>
        {/* Juice Items */}
        {[
          { id: 'z1', name: 'Strawberry Juice', price: '1.50JD', src: z1 },
          { id: 'z2', name: 'Orange Juice', price: '1.75JD', src: z2 },
          { id: 'z3', name: 'Mango Juice', price: '1.50JD', src: z3 },
          { id: 'z4', name: 'Pineapple Juice', price: '5.00JD', src: z4 },
          { id: 'z5', name: 'Lemon Juice', price: '1.75JD', src: z5 },
          { id: 'z8', name: 'Cocktail Juice', price: '2.75JD', src: z8 },
          { id: 'z7', name: 'Guava Juice', price: '2.75JD', src: z7 },
          { id: 'z9', name: 'Avocado Juice', price: '2.75JD', src: z9 }
        ].map((item, index) => (
          <div id='card' key={index}>
           <img id='imgcard2' src={item.src} alt={item.name} />
    <h2 id='textcard1'>{item.name}</h2>
    <h4 id='textcard2'>{item.price}</h4>
    <Button 
  variant="contained" 
  sx={{
    color: 'green',
    backgroundColor: 'white',
    border: '1px solid green',
    width: '250px',
    marginLeft: '25px',
    '&:hover': {
      backgroundColor: 'green',
      color: 'white',
    },
  }} 
  onClick={() => addToCart({ name: item.name, price: item.price, image: item.src })}
>
  ADD TO ORDER
</Button>          </div>
        ))}
      </div>

      {/* Modal for Shopping Cart */}
      <Modal
      open={isCartModalOpen}
      // بتغلق السله
      onClose={toggleCartModal}
      aria-labelledby="cart-modal-title"
      aria-describedby="cart-modal-description"
    >
      <Box sx={{ ...cartModalStyle }}>
        <div style={{ color: 'black', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px' }}>
          <h2 id="cart-modal-title">Shopping Cart</h2>
          {/* كبسه اغلاق السله */}
          <Button 
            onClick={toggleCartModal} 
            style={{ color: '#ff4d4d', fontWeight: 'bold' }} 
            variant="text"
          >
            Close
          </Button>

        </div>
        <div id="cart-modal-description" style={{ padding: '16px' }}>
          {/* عباره عن شرط بحال وجود اصناف في السله او لا */}
          {cart.length === 0 ? (
            // بتنفذ بحال كانت السله فاضيه
            <p style={{ color: '#555', textAlign: 'center' }}>Your cart is empty.</p>
          ) :
          // بتنفذ بحال كانت السله مليانه 
          (
            cart.map((item, index) => (
              <Box 
                key={index} 
                sx={{ 
                  border: '1px solid #ddd', 
                  borderRadius: '8px', 
                  padding: '16px', 
                  marginBottom: '16px',
                  ...cartItemStyle // Apply animation style
                }}
              >
                <CartItem
                // جزئيه الزياده والنقصان والحذف في عدد كل منتج
                  item={item}
                  onRemove={() => dispatch({ type: 'REMOVE_FROM_CART', payload: index })}
                  onIncrease={() => updateQuantity(index, (item.quantity ?? 1) + 1)}
                  onDecrease={() => updateQuantity(index, Math.max((item.quantity ?? 1) - 1, 1))}
                />
              </Box>
            ))
          )}
          {/* مكان كتابه كود الخصم */}
          <TextField
            label="Discount Code"
            variant="outlined"
            value={discountCode}
            onChange={(e) => setDiscountCode(e.target.value)}
            style={{ marginBottom: '16px', width: '100%',marginTop:'20px' }}
          />
          {/* كبسه الخصم فيها شرط */}
          <Button
            onClick={() => {
              // بحال دخلت 1234 بتنفذ الخصم
              if (discountCode === '1234') {
                setDiscountAmount(2); // Apply a fixed discount
                setMessage('Discount code applied successfully!');
              } else {
                // غير هيك ما بتنفذ الخصم
                setDiscountAmount(0);
                setMessage('Invalid discount code.');
              }
            }}
            style={{ marginBottom: '16px', backgroundColor: '#28a745', color: '#fff', borderRadius: '18px', fontSize: 'large' }}
            variant="contained"
          >
            Apply Discount

          </Button>

          {/* والسعر بعد الخصم معلومات المجموع وكميه الخصم */}
          <div style={{ marginBottom: '16px' }}>
            <h3>Total Amount: {cart.reduce((total, item) => total + parseFloat(item.price.replace('JD', '')) * (item.quantity ?? 1), 0).toFixed(2)} JD</h3>
            <h3>Discount Amount: {discountAmount.toFixed(2)} JD</h3>
            <h3>Final Amount: {(cart.reduce((total, item) => total + parseFloat(item.price.replace('JD', '')) * (item.quantity ?? 1), 0) - discountAmount).toFixed(2)} JD</h3>
          </div>

          {/* كبسه place order */}
          <Button
            onClick={() => {
              placeOrder();
              // اغلاق السله
              toggleCartModal(); 
            }}
            style={{ backgroundColor: '#28a745', color: '#fff', borderRadius: '18px', fontSize: 'large' }}
            variant="contained"
          >
            Place Order
          </Button>
          {/* كود خاص بعرض المسجات المتعلقه بالسله */}
          {message && (
            <div 
              style={{ 
                marginTop: '16px', 
                padding: '12px', 
                borderRadius: '8px', 
                backgroundColor: discountAmount > 0 ? '#d4edda' : '#f8d7da', 
                color: discountAmount > 0 ? '#155724' : '#721c24', 
                fontWeight: 'bold', 
                border: `1px solid ${discountAmount > 0 ? '#c3e6cb' : '#f5c6cb'}`, 
                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)' 
              }}
            >
              {message}
            </div>
          )}
        </div>
      </Box>
    </Modal>


{/* payment */}
<Modal
// بحدد ااذا السله فاتحه ام لا
        open={isPaymentModalOpen}
        // تستدعى عند اغلاق جزئيه الدفع
        onClose={() => setIsPaymentModalOpen(false)}
        aria-labelledby="modal-payment-title"
        aria-describedby="modal-payment-description"
      >
        {/* مسج الدفع */}
        <Box sx={paymentModalStyle}>
          
          {/* ايقونه الاغلاق */}
          <IconButton
            onClick={() => setIsPaymentModalOpen(false)}
            sx={{ position: 'absolute', top: 8, right: 8 }}
          >
            <CloseIcon />
          </IconButton>


          <h2 id="modal-payment-title">Payment Information</h2>

          <form onSubmit={formik.handleSubmit}>
            {/* input: Card number */}
            <TextField
              fullWidth
              id="cardNumber"
              name="cardNumber"
              label="Card Number"
              value={formik.values.cardNumber}
              onChange={formik.handleChange}
              error={formik.touched.cardNumber && Boolean(formik.errors.cardNumber)}
              helperText={formik.touched.cardNumber && formik.errors.cardNumber}
              margin="normal"
              inputProps={{ maxLength: 19 }} // Adjust as needed for formatting
              onInput={(e: React.ChangeEvent<HTMLInputElement>) => {
                // Add space after every 4 digits
                e.target.value = e.target.value.replace(/\s?/g, '').replace(/(\d{4})/g, '$1 ').trim();
              }}
            />


       {/* input: Date */}
            <TextField
              fullWidth
              id="expiryDate"
              name="expiryDate"
              label="Expiry Date (MM/YY)"
              value={formik.values.expiryDate}
              onChange={formik.handleChange}
              error={formik.touched.expiryDate && Boolean(formik.errors.expiryDate)}
              helperText={formik.touched.expiryDate && formik.errors.expiryDate}
              margin="normal"
              inputProps={{ maxLength: 5 }} // Adjust as needed for formatting
              onInput={(e: React.ChangeEvent<HTMLInputElement>) => {
                // Add slash after first 2 digits
                e.target.value = e.target.value.replace(/^(\d{2})(\d{0,2})/, '$1/$2');
              }}
            />

           {/* input: cvv */}
            <TextField
              fullWidth
              id="cvv"
              name="cvv"
              label="CVV"
              value={formik.values.cvv}
              onChange={formik.handleChange}
              error={formik.touched.cvv && Boolean(formik.errors.cvv)}
              helperText={formik.touched.cvv && formik.errors.cvv}
              margin="normal"
              inputProps={{ maxLength: 3 }}
            />
            {/* كبسه تاكيد الدفع */}
            <Button color="primary" variant="contained" fullWidth type="submit" style={{ marginTop: '16px' }}>
              Confirm Payment
            </Button>
          </form>
        </Box>
      </Modal>


     {/* ايقون السله*/}
     <Button 
  onClick={toggleCartModal} 
  style={{ 
    background:'#018749' ,
    color: '#fff',
    borderRadius: '80px', 
    fontSize: '1.2rem', 
    position: 'fixed', 
    bottom: '20px', 
    right: '15px', 
    animation: 'bounce 2s infinite',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)', 
    transition: 'background-color 0.3s ease, transform 0.3s ease',
    justifyContent: 'center',
    width: '82px',
    height: '78px'
  }} 
  variant="contained" 
  startIcon={
    // بعرض عدد الاصناف يلي بالسله باللون الاحمر
    <Badge badgeContent={cart.length} color="error">
      <LocalMallIcon style={{ zoom: '250%', marginLeft: '5px' }}/>
    </Badge>

  }
>
</Button>



{/* جزئيه table */}
      {/* Order History */}
      <h2  style={{color:"#008B8B"}}>Order History</h2>
      <table className="table" id="order-history-table" style={{ width: '90%', borderCollapse: 'collapse',marginLeft:'70px',"marginBottom":'150px'}}>
        <thead>
          <tr>
            <th>Order Number</th>
            <th>Order Time</th>
            <th>Items</th>
            <th>Total Amount (JD)</th>
          </tr>
        </thead>
        <tbody>
          {orders.length === 0 ? (
            <tr>
              <td colSpan={4}>No orders placed yet.</td>
            </tr>
          ) : (
            orders.map(order => (
              <tr  key={order.orderNumber} >
                <td>{order.orderNumber}</td>
                <td>{order.orderTime}</td>
                <td>
                  <ul>
                    {order.items.map((item, index) => (
                      <li style={{marginBottom:'20px'}} key={index}>{item.name} - {item.price} - Quantity: {item.quantity}</li>
                    ))}
                  </ul>
                </td>
                <td>{order.totalAmount.toFixed(2)}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>

     {/* حاض بعرض المسجات في اسفل الصفحه */}
      <Snackbar open={Boolean(message)} autoHideDuration={2000} onClose={() => setMessage(null)}>
        <Alert onClose={() => setMessage(null)} severity="info" sx={{ width: '100%' }}>
          {message}
        </Alert>
      </Snackbar>



      
    </div>
  );
};

export default Home;
