//Header.jsx
import styles from './Header.module.css'
import { useState, useEffect } from 'react';
import { FaShoppingCart, FaBars } from 'react-icons/fa';
import { IoPerson,IoClose, IoSearchOutline } from "react-icons/io5";
import Nav from '../Nav/Nav';
import { useNavigate } from 'react-router-dom';
import SideCard from '../../Pages/Cart/sideCart';
import { useCart } from '../../Context/AppContext';

export default function Header(){
    const [menuOpen,setMenuOpen] = useState(false)
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 600);
    const [cartOpen,setCartOpen] = useState(false)
    const navigate = useNavigate();
    
    const { cartItems } = useCart();
    const totalQuantity = cartItems.reduce((acc, item) => acc + item.quantity, 0);

    useEffect(()=>{
        const handleResize = () =>{
            setIsMobile(window.innerWidth <= 600);
            if(window.innerWidth>600){
                setMenuOpen(false)
                
            }
        }
        window.addEventListener('resize',handleResize)
        return () => window.removeEventListener('resize',handleResize)
    },[])
   
    return(
        <header>
            
            <div>
                <img src="./img/lrLogo.png" alt="" className={styles.logo}/>
                {/*Ícone do menu hamburguer */}
                <div className={styles.searchControl}>
                    <input type="text" name="" id="" />
                    <IoSearchOutline className={styles.searchIcon}/>

                </div>

                {/*para mobile --------- */}
                {isMobile && ( <button className={styles.menuButton} onClick={()=> setMenuOpen(!menuOpen)}>
                    {menuOpen ? '': <FaBars/>}
                </button> )}
                {/*Menu lateral */}
                {isMobile &&(
                <nav className={`${styles.sideMenu} ${menuOpen ? styles.open : ''}`}>
                    <IoClose className={styles.closeMenu} onClick={()=> setMenuOpen(!menuOpen)}/>
                    <ul className={styles.linksMobile}>
                        <li onClick={() => navigate('/')}>Home</li>
                        <li>Fale Conosco</li>
                        <li>Tailandesas</li>
                        <li>Retrôs</li>
                        <li>Carrinho</li>
                        <li>Minha Conta</li>
                    </ul>
                </nav>)}

                 {/* Mostra a lista normal em telas maiores que 600px */}
                 {!isMobile && (
                    <ul className={styles.links}>
                        
                        <div>
                            <li className={styles.iconsLink}><FaShoppingCart onClick={() => setCartOpen(true)} />{totalQuantity > 0 && (
                                <span className={styles.quantityProductsCart}>{totalQuantity}</span>
                            )}
                            </li>
                            <li className={styles.iconsLink}><IoPerson onClick={() => navigate('/login')}/></li>
                        </div>
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