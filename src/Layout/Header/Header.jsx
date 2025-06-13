//Header.jsx
import styles from './Header.module.css'
import { useState, useEffect } from 'react';
import { FaShoppingCart, FaBars } from 'react-icons/fa';
import { IoPerson,IoClose, IoSearchOutline } from "react-icons/io5";
import Nav from '../Nav/Nav';
import { db } from '../../backend/firebase';
import { collection,getDocs } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import SideCard from '../../Pages/Cart/sideCart';
import { useCart } from '../../Context/AppContext';
import logo from '../../img/lrLogo.png'
export default function Header(){
    const [searchQuery,setSearchQuery] = useState('')
    const [suggestions, setSuggestions] = useState([])
    const [menuOpen,setMenuOpen] = useState(false)
    const [isMobile, setIsMobile] = useState(false);
    const [cartOpen,setCartOpen] = useState(false)
    const navigate = useNavigate();
    
    const { cartItems } = useCart();
    const totalQuantity = cartItems.reduce((acc, item) => acc + item.quantity, 0);

    useEffect(()=>{
        const fetchSuggestions = async () =>{
            if(searchQuery.trim()===''){
                setSuggestions([])
                return
            }

            const queryLower = searchQuery.toLowerCase()
            const snapshot = await getDocs(collection(db, 'camisas'))

            const filtered = snapshot.docs
                .map(doc=>({id:doc.id,...doc.data()}))
                .filter(prod => prod.nome.toLowerCase().includes(queryLower))

            setSuggestions(filtered.slice(0,5)) //limita a 5 sugestões
        }

        const delayDebounce = setTimeout(()=>{
            fetchSuggestions()
        },300) //espera 300ms antes de buscar

        return()=> clearTimeout(delayDebounce)
    },[searchQuery])

    useEffect(()=>{
        const handleResize = () =>{
            const mobile = window.innerWidth <= 767;
            setIsMobile(mobile);
            console.log("isMobile:", mobile);
            if(!mobile) setMenuOpen(false);
        }
        handleResize()
        window.addEventListener('resize',handleResize)
        return () => window.removeEventListener('resize',handleResize)
    },[])
   
    return(
        <header>
            
            <div>
                <img src={logo} alt="" className={styles.logo} onClick={() => navigate('/')}/>
                {/*Ícone do menu hamburguer */}
                <div className={styles.searchControl}>
                    <input type="text" name="" id="" value={searchQuery}
                    onChange={(e)=> setSearchQuery(e.target.value)}/>
                    <IoSearchOutline className={styles.searchIcon}/>

                    {searchQuery && suggestions.length>0 && (
                        <ul className={styles.suggestionsList}>
                            {suggestions.map((item)=>(
                                <li
                                    key={item.id}
                                    className={styles.suggestionItem}
                                    onClick={()=>{
                                        navigate(`/individualProduct/${item.id}`)
                                        setSearchQuery('')
                                        setSuggestions([])
                                    }}
                                >
                                    <img src={item.image} alt="" className={styles.imgItem}/>
                                    {item.nome}
                                </li>
                            ))}

                        </ul>
                    )}
                </div>

                {/*para mobile --------- */}
                {isMobile && (
                    <div className={styles.menuButtonContainer}>
                        <button className={styles.menuButton} onClick={() => setMenuOpen(!menuOpen)}>
                        {!menuOpen && <FaBars />}
                        </button>
                        {totalQuantity > 0 && (
                        <span className={styles.quantityProductsCartMobile}>{totalQuantity}</span>
                        )}
                    </div>
                )}
                {/*Menu lateral */}
                {isMobile &&(
                <nav className={`${styles.sideMenu} ${menuOpen ? styles.open : ''}`}>
                    <IoClose className={styles.closeMenu} onClick={()=> setMenuOpen(!menuOpen)}/>
                    <ul className={styles.linksMobile}>
                        <li onClick={() => {
                           navigate('/')
                           setMenuOpen(!menuOpen)
                        }}>Home</li>
                        <li onClick={() => {
                            navigate('/contact') 
                            setMenuOpen(!menuOpen)
                        }}>Fale Conosco</li>
                        <li onClick={()=> {
                            navigate('/products', {state:{tipo: 'clube'}})
                            setMenuOpen(!menuOpen)
                        }}>Tailandesas</li>
                        <li onClick={()=> {
                            navigate('/products', {state:{tipo: 'retro'}})
                            setMenuOpen(!menuOpen)
                        }}>Retrôs</li>
                        <li onClick={()=>{
                            navigate('/cart')
                            setMenuOpen(!menuOpen)
                        }} className={styles.itemCart}>Carrinho{totalQuantity > 0 && (
                        <span className={styles.quantityProductsCartMobileInline}>{totalQuantity}</span>
                        )}</li>
                        <li onClick={() =>{
                            navigate('/login')
                            setMenuOpen(!menuOpen)
                        }}>Minha Conta</li>
                    </ul>
                </nav>)}

                 {/* Mostra a lista normal em telas maiores que 600px */}
                 {!isMobile && (
                    <ul className={styles.links}>
                        
                        
                            <li className={styles.iconsLink}><FaShoppingCart onClick={() => setCartOpen(true)} />
                            {totalQuantity > 0 && (
                                <span className={styles.quantityProductsCart}>{totalQuantity}</span>
                            )}
                            </li>
                            <li className={styles.iconsLink}><IoPerson onClick={() => navigate('/login')}/></li>
                        
                    </ul>
                
                )}
                <SideCard isOpen={cartOpen} onClose={() => setCartOpen(false)} />
            </div>
                {/*não é mobile */}
            {!isMobile &&(
                <Nav/>
            )}
            
        </header>
    )
}