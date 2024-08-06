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

interface Item {
  name: string;
  price: string;
  quantity?: number;
  image?: string; 
}


interface Order {
  orderNumber: number;
  orderTime: string;
  items: Item[];
  totalAmount: number;
}


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
      // يتحقق من أن الشهر والسنة في المستقبل أو الآن
      return parsedDate.getFullYear() > new Date().getFullYear() || 
             (parsedDate.getFullYear() === new Date().getFullYear() && parsedDate.getMonth() >= new Date().getMonth());
    }),
  cvv: yup
    .string()
    .required('CVV is required')
    .matches(/^[0-9]{3}$/, 'CVV is not valid'), // يحقق أن CVV يحتوي على 3 أرقام
});



type ActionType = 
  | { type: 'ADD_TO_CART'; payload: Item }
  | { type: 'REMOVE_FROM_CART'; payload: number }
  | { type: 'UPDATE_QUANTITY'; payload: { index: number; quantity: number } }
  | { type: 'CLEAR_CART' };

const initialState: Item[] = [];

const CartItem: React.FC<{ item: Item; onRemove: () => void; onIncrease: () => void; onDecrease: () => void }> = ({ item, onRemove, onIncrease, onDecrease }) => {
  return (
    <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #ddd', borderRadius: '8px', padding: '8px', marginBottom: '8px' }}>
      {item.image && <img src={item.image} alt={item.name} style={{ width: '50px', height: '50px', objectFit: 'cover', marginRight: '8px' }} />}
      <div style={{ flex: 1 }}>
        <span>{item.name} - {item.price} - Quantity: </span>
        <Button onClick={onDecrease} style={{ color: 'orange' }}>-</Button>
        <span>{item.quantity || 1}</span>
        <Button onClick={onIncrease} style={{ color: 'orange' }}>+</Button>
        <Button onClick={onRemove} style={{ color: 'red' }}>Remove</Button>
      </div>
    </div>
  );
};



// جزئيه الزياده والنقصان والاضافه الى السله
function reducer(state: Item[], action: ActionType): Item[] {
  switch (action.type) {
    case 'ADD_TO_CART':
      const existingItemIndex = state.findIndex(item => item.name === action.payload.name);
      if (existingItemIndex > -1) {
        return state.map((item, index) => 
          index === existingItemIndex ? { ...item, quantity: (item.quantity ?? 0) + 1 } : item
        );
      } else {
        return [...state, { ...action.payload, quantity: 1 }];
      }
    case 'REMOVE_FROM_CART':
      return state.filter((_, index) => index !== action.payload);
    case 'UPDATE_QUANTITY':
      return state.map((item, index) =>
        index === action.payload.index ? { ...item, quantity: action.payload.quantity } : item
      );
    case 'CLEAR_CART':
      return [];
    default:
      return state;
  }
}

const Home: React.FC = () => {


  const formik = useFormik({
    initialValues: {
      cardNumber: '',
      expiryDate: '',
      cvv: '',
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      confirmPayment(values);
    },
  });
  const cardsRef = React.useRef<HTMLDivElement>(null);
  const scrollToCards = () => {
    if (cardsRef.current) {
      cardsRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const [cart, dispatch] = useReducer(reducer, initialState);
  const [orders, setOrders] = useState<Order[]>([]);
  const [orderCount, setOrderCount] = useState(0);
  const [isCartModalOpen, setIsCartModalOpen] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [discountCode, setDiscountCode] = useState('');
  const [discountAmount, setDiscountAmount] = useState(0);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

  const isLoggedIn = Boolean(localStorage.getItem('isLoggedIn'));

  const addToCart = (item: Item) => {
    if (!isLoggedIn) {
      alert('Please log in to add items to your cart.');
      return;
    }
    dispatch({ type: 'ADD_TO_CART', payload: item });
  };

  const updateQuantity = (index: number, quantity: number) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { index, quantity } });
  };

  const placeOrder = () => {
    if (cart.length === 0) {
      setMessage('Your cart is empty.');
      return;
    }
      setIsPaymentModalOpen(true);
  };
  const confirmPayment = (values: { cardNumber: string; expiryDate: string; cvv: string }) => {
    const orderNumber = orderCount + 1;
    const currentTime = new Date().toLocaleString();
    const totalAmount = cart.reduce((total, item) => total + parseFloat(item.price.replace('JD', '')) * (item.quantity ?? 1), 0);
    const finalAmount = totalAmount - discountAmount;

  
    // Ensure finalAmount is not negative
    const adjustedFinalAmount = Math.max(finalAmount, 0);
  
    const aggregatedOrder: Order = {
      orderNumber,
      orderTime: currentTime,
      items: [...cart],
      totalAmount: adjustedFinalAmount
    };
  
    setOrders(prevOrders => [...prevOrders, aggregatedOrder]);
    setOrderCount(orderNumber);
    dispatch({ type: 'CLEAR_CART' });
    setIsCartModalOpen(false);
    setIsPaymentModalOpen(false);  
    setMessage(`Order placed successfully! Final amount after discount: ${adjustedFinalAmount.toFixed(2)} JD`);
  };

  const toggleCartModal = () => {
    setIsCartModalOpen(!isCartModalOpen);
  };

  const cartModalStyle = {
    position: 'absolute' as const,
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 633,
    maxHeight: '70vh',
    overflowY: 'auto', 
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
  };

  const paymentModalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '90%',
    maxWidth: '500px',
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
    borderRadius: '8px',
  };
  
// السله
  const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

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
const modalStyle = css`
  animation: ${fadeIn} 0.3s ease-in;
`;

// Styles for cart item
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
          <Button onClick={scrollToCards} style={{ backgroundColor: '#26cc00', borderRadius: '18px', fontSize: 'large', marginLeft: '540px' }} variant="contained" className='button1'>View Menu</Button>
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
        ].map((item, index) => (
          <div id='card' key={index}>
           <img id='imgcard' src={item.src} alt={item.name} />
    <h2 id='textcard1'>{item.name}</h2>
    <h4 id='textcard2'>{item.price}</h4>
    <Button variant="contained" style={{ color: 'green', backgroundColor: 'white', border: '1px solid green', width: '250px', marginLeft: '25px' }} onClick={() => addToCart({ name: item.name, price: item.price, image: item.src })}>ADD TO ORDER</Button>
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
    <Button variant="contained" style={{ color: 'green', backgroundColor: 'white', border: '1px solid green', width: '250px', marginLeft: '25px' }} onClick={() => addToCart({ name: item.name, price: item.price, image: item.src })}>ADD TO ORDER</Button>
          </div>
        ))}
      </div>

      {/* Modal for Shopping Cart */}
      <Modal
      open={isCartModalOpen}
      onClose={toggleCartModal}
      aria-labelledby="cart-modal-title"
      aria-describedby="cart-modal-description"
    >
      <Box sx={{ ...cartModalStyle }}>
        <div style={{ color: 'black', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px' }}>
          <h2 id="cart-modal-title">Shopping Cart</h2>
          <Button 
            onClick={toggleCartModal} 
            style={{ color: '#ff4d4d', fontWeight: 'bold' }} 
            variant="text"
          >
            Close
          </Button>
        </div>
        <div id="cart-modal-description" style={{ padding: '16px' }}>
          {cart.length === 0 ? (
            <p style={{ color: '#555', textAlign: 'center' }}>Your cart is empty.</p>
          ) : (
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
                  item={item}
                  onRemove={() => dispatch({ type: 'REMOVE_FROM_CART', payload: index })}
                  onIncrease={() => updateQuantity(index, (item.quantity ?? 1) + 1)}
                  onDecrease={() => updateQuantity(index, Math.max((item.quantity ?? 1) - 1, 1))}
                />
              </Box>
            ))
          )}
          <TextField
            label="Discount Code"
            variant="outlined"
            value={discountCode}
            onChange={(e) => setDiscountCode(e.target.value)}
            style={{ marginBottom: '16px', width: '100%',marginTop:'20px' }}
          />
          <Button
            onClick={() => {
              if (discountCode === '1234') {
                setDiscountAmount(2); // Apply a fixed discount
                setMessage('Discount code applied successfully!');
              } else {
                setDiscountAmount(0);
                setMessage('Invalid discount code.');
              }
            }}
            style={{ marginBottom: '16px', backgroundColor: '#28a745', color: '#fff', borderRadius: '18px', fontSize: 'large' }}
            variant="contained"
          >
            Apply Discount
          </Button>
          <div style={{ marginBottom: '16px' }}>
            <h3>Total Amount: {cart.reduce((total, item) => total + parseFloat(item.price.replace('JD', '')) * (item.quantity ?? 1), 0).toFixed(2)} JD</h3>
            <h3>Discount Amount: {discountAmount.toFixed(2)} JD</h3>
            <h3>Final Amount: {(cart.reduce((total, item) => total + parseFloat(item.price.replace('JD', '')) * (item.quantity ?? 1), 0) - discountAmount).toFixed(2)} JD</h3>
          </div>
          <Button
            onClick={() => {
              placeOrder();
              toggleCartModal(); 
            }}
            style={{ backgroundColor: '#28a745', color: '#fff', borderRadius: '18px', fontSize: 'large' }}
            variant="contained"
          >
            Place Order
          </Button>
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
        open={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        aria-labelledby="modal-payment-title"
        aria-describedby="modal-payment-description"
      >
        <Box sx={paymentModalStyle}>
          <IconButton
            onClick={() => setIsPaymentModalOpen(false)}
            sx={{ position: 'absolute', top: 8, right: 8 }}
          >
            <CloseIcon />
          </IconButton>
          <h2 id="modal-payment-title">Payment Information</h2>
          <form onSubmit={formik.handleSubmit}>
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
              inputProps={{ maxLength: 3 }} // Adjust as needed for formatting
            />
            <Button color="primary" variant="contained" fullWidth type="submit" style={{ marginTop: '16px' }}>
              Confirm Payment
            </Button>
          </form>
        </Box>
      </Modal>


     {/* icon shop */}
<Button 
  onClick={toggleCartModal} 
  style={{ 
    backgroundColor: 'green', 
    color: '#fff',
    borderRadius: '80px', 
    fontSize: '1.2rem', 
    position: 'fixed', 
    bottom: '20px', 
    right: '15px', 
    animation: 'bounce 2s infinite',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)', 
    transition: 'background-color 0.3s ease, transform 0.3s ease', // Smooth transition
   
    justifyContent: 'center',
    width:'82px',
    height:'78px'
  }} 
  variant="contained" 
  startIcon={
    <Badge badgeContent={cart.length} color="secondary">
      <LocalMallIcon  style={{zoom:'250%',marginLeft:'5px'}}/>
    </Badge>
  }
>
</Button>

      {/* Order History */}
      <h2 id="a">Order History</h2>
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
              <tr key={order.orderNumber}>
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

      {/* Message Box */}
      <Snackbar open={Boolean(message)} autoHideDuration={6000} onClose={() => setMessage(null)}>
        <Alert onClose={() => setMessage(null)} severity="info" sx={{ width: '100%' }}>
          {message}
        </Alert>
      </Snackbar>



      
    </div>
  );
};

export default Home;
